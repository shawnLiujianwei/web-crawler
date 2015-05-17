/**
 * Created by Shawn Liu on 15-5-15.
 */

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;
var Promise = require("bluebird");
var logger = require("node-config-logger").getLogger("components/crawler/executor.js");
var retailerService = require("./retailer");
var async = require("async");
var useSeleniumServer = true;
var path = require("path");
var fs = require("fs");
exports.priceSpider = function (productUrl, locale, site, browser) {
    return retailerService.extractDomain(site, productUrl)
        .then(function (retailerID) {
            return retailerService.getSelector(locale, retailerID)
        })
        .then(function (selectoConfig) {
            return _scrape(productUrl, selectoConfig, browser);
        })
        .then(function (product) {
            return product;
        })
        .catch(function (err) {
            logger.error(err);
        });
}

function _scrape(productURL, selectors, browser) {
    if (!browser) {
        browser = "firefox";
    }
    return new Promise(function (resolve, reject) {
        if (_checkValidBrowser(browser)) {
            var driver = "";
            if (useSeleniumServer) {
                driver = new webdriver.Builder()
                    .forBrowser(browser)
                    .usingServer('http://127.0.0.1:4444/wd/hub')
                    //.usingServer('http://127.0.0.1:9444')
                    .build();
            } else {
                driver = new webdriver.Builder()
                    .forBrowser(browser)
                    .build();
            }
            driver.get(productURL);
            var tmp = {
                "status": true,
                "errors": []
            };

            //driver.wait(until.elementIsVisible(driver.findElement(By.css("#itemDetails"))), 5000)
            //    .then(function () {
            //logger.info("Page loaded");
            //return driver.takeScreenshot()
            //    .then(function (data) {
            //        writeScreenshot(data, 'out1.png');
            //    })
            //    .then(function () {
            logger.info("Begin to scrape");
            async.until(function isDone() {
                return selectors.length === 0;
            }, function next(callback) {
                var selector = selectors.shift();
                var byC = "";
                if (selector.selectorType === "css") {
                    byC = By.css(selector.content);
                } else {
                    byC = By.xpath(selector.content);
                }
                var element = driver.findElement(byC);
                element.getText()
                    .then(function (content) {
                        tmp[selector.field] = content;
                        callback()
                    }, function onError(err) {
                        logger.error(err.message);
                        tmp.status = false;
                        tmp.errors.push({
                            "selector": selector.field,
                            "message": err.message
                        });
                        callback();
                    })
            }, function done() {
                driver.quit();
                resolve(tmp)
            });
            //})


        } else {
            logger.error("Invalid browser '%s'", browser);
        }


    });
}

function _checkValidBrowser(browser) {
    return true;
}

function writeScreenshot(data, name) {
    name = name || 'ss.png';
    var screenshotPath = path.join(__dirname, "");
    fs.writeFileSync(screenshotPath + name, data, 'base64');
};
