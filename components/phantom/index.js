/**
 * Created by Shawn Liu on 15-5-16.
 */

var childProcess = require("child_process");
var logger = require("node-config-logger").getLogger("./components/phantom/index.js")
/**
 *
 * @param port
 * @param cb
 */
exports.setupHealthCheck = function (port, cb) {

}

exports.registerPhantomNode = function (hubPort, nodePort) {
    return new Promise(function (resolve, reject) {
        var command = "phantomjs --webdriver=" + nodePort + " --webdriver-selenium-grid-hub=http://127.0.0.1:" + hubPort;
        childProcess.exec(command, function (err, stdout, stderr) {
            if (err) {
                logger.error("Error when register phantom node '%' to Hub '%'", nodePort, hubPort);
                logger.error(err)
                reject();
            } else if (stderr) {
                logger.error("Phantom interior error  ", stderr);
                reject();
            } else {
                resolve();
            }
        });
    })
}
