/**
 * Created by Shawn Liu on 15-5-16.
 */

var Process = require("child_process");
var logger = require("node-config-logger").getLogger("./components/phantom/index.js")
var phantomjs = require('phantomjs')
var binPath = phantomjs.path;
var delay = require("../utils/delayPromise");
/**
 *
 * @param port
 * @param cb
 */
exports.setupHealthCheck = function (port, cb) {

}

exports.registerPhantomNode = function (hubPort, nodePort) {
    logger.info("Begin to register phantom node '%s' to selenium hub '%s'", nodePort, hubPort)
    return new Promise(function (resolve, reject) {
        //var command = "phantomjs --webdriver=" + nodePort + " --webdriver-selenium-grid-hub=http://127.0.0.1:" + hubPort;;
        var args = [];
        args.push(binPath);
        args.push("--webdriver=" + nodePort);
        args.push("--webdriver-selenium-grid-hub=http://127.0.0.1:" + hubPort);
        //childProcess.exec(args.join(" "), function (err, stdout, stderr) {
        //    logger.info("=====================")
        //    if (err) {
        //        logger.error("Error when register phantom node '%' to Hub '%'", nodePort, hubPort);
        //        logger.error(err)
        //        reject();
        //    } else if (stderr) {
        //        logger.error("Phantom interior error  ", stderr);
        //        reject();
        //    } else {
        //        Process.stdout.on('data', function (data) {
        //            logger.info("Phamton Instance :" + data.toString());
        //        });
        //        Process.stderr.on('data', function (data) {
        //            logger.error("Phamton Instance :" + data.toString());
        //        });
        //        resolve();
        //    }
        //});
        var isRejected = false;
        var process = Process.exec(args.join(" "), function (err, data) {
            logger.error(err);
            isRejected = true;
            reject();
        })
        delay(1000)
            .then(function () {
                if (!isRejected) {
                    logger.info("Register phantom node '%s' to selenium hub '%s'", nodePort, hubPort);
                    process.stdout.on('data', function (data) {
                        logger.info("Phantom Node :" + data.toString());
                    });
                    process.stderr.on('data', function (data) {
                        logger.error("Phantom Node :" + data.toString());
                    });
                    resolve();
                }

            })
    })
}
