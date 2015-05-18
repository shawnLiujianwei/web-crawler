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
exports.priceSpider = function (productURL, locale, site) {
    return exports.getAvailablePort()
        .then(function (port) {
            return crawlerExecutor.priceSpider(productURL, locale, site, port);
        })
}

var phantomInstances = [];
var lastPick = 0;
exports.getAvailablePort = function () {
    for (var i = 0; i < phantomInstances.length; i++) {
        var instance = phantomInstances[lastPick++ % phantomInstances.length];
        //if (instance.queue.size() === config.maxQueueSize) {
        //    logger.warn("phantom worker " + instance.id + " queue is full " + instance.queue.size());
        //} else if (instance.queue.shuttingDown) {
        //    logger.warn("phantom worker " + instance.id + " is going to be shutdown , still has " + instance.queue.size() + " jobs left");
        //} else {
        //    return instance.start();
        //}
        return Promise.resolve(instance);
    }
    return Promise.reject("All queues are full");
}

exports.setupCrawlerServer = function () {
    var hubPort = listenerConfig.seleniumHub;
    return seleniumServer.createHub(hubPort)
        .then(function () {
            return Promise.map(listenerConfig.seleniumServer, function (port) {
                //return seleniumServer.registerSeleniumNode(hubPort, port);
            })
        })
        .then(function () {
            return Promise.map(listenerConfig.phantomCluster, function (port) {
                return phantomInstance.registerPhantomNode(hubPort, port)
                    .then(function () {
                        phantomInstances.push(port);
                    })
            });
        })
}