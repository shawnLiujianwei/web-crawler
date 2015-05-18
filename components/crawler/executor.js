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
var cacheServicae = require("../db/cache");
var errorLog = require("../db/errorLog");
exports.priceSpider = function (productUrl, locale, site, port) {
    return retailerService.getSelector(productUrl, locale, site)
        .then(function (selectorConfig) {
            if (selectorConfig && selectorConfig.status) {
                return _scrape(productUrl, selectorConfig.selectors, port)
                    .then(function (product) {
                        //return product;
                        return cacheServicae.insert(product)
                            .then(function () {
                                return product;
                            })
                    })
            } else {
                return selectorConfig;
            }
        })
        .catch(function (err) {
            logger.error(err);
            return {
                "status": false,
                "message": err.message || err
            };
        });
}

function _scrape(productURL, selectors, port) {
    //if (!browser) {
    //    browser = "firefox";
    //}
    var browser = "phantomjs";
    return new Promise(function (resolve, reject) {

        try {
            if (_checkValidBrowser(browser)) {
                var driver = "";
                if (useSeleniumServer) {
                    driver = new webdriver.Builder()
                        .forBrowser(browser)
                        .usingServer('http://127.0.0.1:' + port)
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

                logger.info("scraping ", productURL);
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
                    tmp.updateDate = new Date();
                    resolve(tmp)
                });
                //})


            } else {
                logger.error("Invalid browser '%s'", browser);
            }
        } catch (err) {
            logger.error(err);
            errorLog.insert(err)
                .then(function () {

                })
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
