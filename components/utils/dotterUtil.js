/**
 * Created by Shawn Liu on 15-5-16.
 */
var Promise = require("bluebird");
var Process = require("child_process");
var logger = require("node-config-logger").getLogger("./components/utils/dotterUtil.js");
exports.freePort = function (port) {
    return new Promise(function (resolve, reject) {
        logger.info("freeing up port " + port + " if still in use");
        //var command = "kill -9 `lsof -n -iTCP:" + port + " | grep LISTEN | awk '{print $2}'`";
        var command = "kill $(lsof -t -i:" + port + ")";
        Process.exec(command, function () {
            resolve();
        });
    });
}

exports.pintPort = function(port) {
    return new Promise(function(resolve,reject){
        var comand = "curl "
    })
}