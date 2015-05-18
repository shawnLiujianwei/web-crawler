/**
 * Created by Shawn Liu on 15-5-16.
 */
var Promise = require("bluebird");
var Process = require("child_process");
var logger = require("node-config-logger").getLogger("./components/utils/dotterUtil.js");
var os = require("os");
exports.freePort = function (port) {
    return new Promise(function (resolve, reject) {
        logger.info("freeing up port " + port + " if still in use");
        //var command = "kill -9 `lsof -n -iTCP:" + port + " | grep LISTEN | awk '{print $2}'`";
        var command = "kill $(lsof -t -i:" + port + ")";
        if (os.platform().indexOf("win") === -1) {
            Process.exec(command, function (err, data) {
                if (err) {
                    logger.error(err);
                    reject();
                } else {
                    resolve();
                }
            });
        } else {
            logger.info("your OS is windows , will ignore this command");
            resolve();
        }

    });
}

exports.pintPort = function (port) {
    return new Promise(function (resolve, reject) {
        var comand = "ping http://127.0.0.1:" + port;
    })
}