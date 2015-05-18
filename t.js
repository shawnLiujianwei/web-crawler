/**
 * Created by Shawn Liu on 15-5-17.
 */
var Process = require("child_process");
var crawler = require("./components/crawler");
crawler.setupCrawlerServer()
    .then(function () {
        console.log("success to setup crawler")
    })
    .catch(function (err) {
        console.error(err);
    })

//var path = require("path");
//var args = [];
//args.push("java")
//args.push("-jar");
//args.push(path.join(__dirname,"./node_modules/selenium-standalone/.selenium/selenium-server/2.45.0-server.jar"));
//args.push("-Dwebdriver.chrome.driver=");
//args.push(path.join(__dirname,"./node_modules/selenium-standalone/.selenium/chromedriver/2.15-x64-chromedriver"));
//args.push("-role hub -port 4444");
//
//Process.exec(args.join(" "),function(err,data){
//console.info("----------------",err)
//    args = [];
//    args.push("java")
//    args.push("-jar");
//    args.push(path.join(__dirname,"./node_modules/selenium-standalone/.selenium/selenium-server/2.45.0-server.jar"));
//    args.push("-Dwebdriver.chrome.driver=");
//    args.push(path.join(__dirname,"./node_modules/selenium-standalone/.selenium/chromedriver/2.15-x64-chromedriver"));
//    args.push("-role node -hub http://127.0.0.1/4444");
//    Process.exec(args.join(" "))
//
//})