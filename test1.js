/**
 * Created by Shawn Liu on 15-5-17.
 */
var crawler = require("./components/crawler");

//var productURL = "http://www.tesco.com/groceries/product/details/?id=255066698";
//crawler.priceSpider(productURL,"en_gb","tesco.com","phantomjs")
//.then(function(data){
//        console.log(data);
//    })
//.catch(function(err){
//        console.error(err);
//    })

var url = "http://www.tesco.com/groceries/product/details/?id=255066698";
//url = "http://item.taobao.com/item.htm?spm=a217j.7695524.1998513388.3.g6nKdH&id=4050140491";
var array = [];
for (var i = 0; i < 100; i++) {
    array.push(url);
}

var Promise = require("bluebird");
var start = new Date();
var count = 0;
Promise.map(array, function (pr) {
    return crawler.priceSpider(pr, "en_gb", null, "phantomjs")
        .then(function (t) {
            count++;
            console.log("---------'%s'----------", count);
            console.log(t);
        })
})
    .then(function () {
        var end = new Date();
        console.log("Take '%s' minutes", (end.getTime() - start.getTime()) / 1000 / 60);
    })
