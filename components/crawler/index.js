/**
 * Created by Shawn Liu on 15-5-15.
 */

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;
var Promise = require("bluebird");
var logger = require("node-config-logger").getLogger("components/crawler/index.js");
var crawlerExecutor = require("./executor");
var seleniumServer = require("../selenium-server/");
var phantomInstance = require("../phantom");
var listenerConfig = require("config").listener;
exports.priceSpider = crawlerExecutor.priceSpider;


exports.setupCrawlerServer = function () {
    var hubPort = listenerConfig.seleniumHub;
    return seleniumServer.createHub(hubPort)
        .then(function () {
            return Promise.map(listenerConfig.seleniumServer, function (port) {
                return seleniumServer.registerSeleniumNode(hubPort, port);
            })
        })
        .then(function () {
            return Promise.map(listenerConfig.phantomCluster, function (port) {
                return phantomInstance.registerPhantomNode(hubPort, port);
            });
        })
}