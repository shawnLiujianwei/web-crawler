/**
 * Created by Shawn Liu on 15-5-16.
 */
var Promise = require("bluebird");
var path = require("path");
var logger = require("node-config-logger").getLogger("components/selenium-server/index.js");
var seleniumStandalone = require("selenium-standalone");
var logger = require("node-config-logger").getLogger("components/selenium-server/SeleniumStandaloneInstance.js");
var dotterUtil = require("../utils/dotterUtil");
var Process = require("child_process");

var seleniumJar = path.join(__dirname,"./node_modules/selenium-standalone/.selenium/selenium-server/2.45.0-server.jar");
var chromedriverPath = path.join(__dirname,"./node_modules/selenium-standalone/.selenium/chromedriver/2.15-x64-chromedriver");
exports.createHub = function (port) {
    if (!port) {
        port = 4444;
    }
    //java -jar selenium-server-standalone-2.44.0.jar -role hub -port 4441

    return dotterUtil.freePort(port)
        .then(function () {
            return new Promise(function (resolve, reject) {
                seleniumStandalone.start({
                    seleniumArgs: [
                        "-role hub",
                        "-port " + port
                    ]
                }, function (err, child) {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    } else {
                        logger.info("Start selenium Hub on port '%s'", port);
                        child.stdout.on('data', function (data) {
                            logger.info(data.toString());
                        });
                        resolve(port);
                    }
                })
            })
        })


}

exports.registerSeleniumNode = function (hubPort, nodePort) {
    if (!hubPort) {
        hubPort = 4444;
    }
    //java -jar selenium-server-standalone-2.44.0.jar -role hub -port 4441
    return new Promise(function (resolve, reject) {
        seleniumStandalone.start({
            seleniumArgs: [
                " -role node",
                " -hub http://127.0.0.1:" + hubPort
            ]
        }, function (err, child) {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                logger.info("Register selenium-standalone node '%s' to selenium hub '%s'", nodePort, hubPort);
                child.stderr.on('data', function (data) {
                    logger.info(data.toString());
                });
                resolve(nodePort);
            }
        })
    })
}
