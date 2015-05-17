/**
 * Created by Shawn Liu on 15-5-17.
 */
var crawler = require("./components/crawler");

var productURL = "http://www.tesco.com/groceries/product/details/?id=255066698";
crawler.priceSpider(productURL,"en_gb","tesco.com","phantomjs")
.then(function(data){
        console.log(data);
    })
.catch(function(err){
        console.error(err);
    })