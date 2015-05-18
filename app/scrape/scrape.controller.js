/**
 * Created by Shawn Liu on 2015/5/18.
 */

var crawler = require("../../components/crawler");
var Error = require("../../components/errors");
exports.scrape = function (req, res) {
    var body = req.body;

}

exports.test = function (req, res) {
    res.json({
        "message": "Begin to test"
    });
    //_runTest();
}

function _runTest() {
    var url = "http://www.tesco.com/groceries/product/details/?id=255066698";
    url = "http://item.taobao.com/item.htm?spm=a217j.7695524.1998513388.3.g6nKdH&id=4050140491";
    var array = [];
    for (var i = 0; i < 10; i++) {
        array.push(url);
    }

    var Promise = require("bluebird");
    var start = new Date();
    var count = 0;
    return Promise.map(array, function (pr) {
        return crawler.priceSpider(pr, "zh_cn", null, "phantomjs")
            .then(function (t) {
                count++;
                console.log("---------'%s'----------", count);
                console.log(t);
            })
    })
        .then(function () {
            var end = new Date();
            console.log("Take '%s' minutes", (end.getTime() - start.getTime()) / 1000 / 60);
            _runTest();
        })
}
