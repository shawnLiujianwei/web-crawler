/**
 * Created by Shawn Liu on 2015/5/18.
 */
var expect = require('chai').expect;
var crawler = require("../../../components/crawler");
describe("Test crawler/index.js", function () {
    //before(function (done) {
    //    crawler.setupCrawlerServer()
    //        .finally(function () {
    //            done();
    //        })
    //})
    it("#priceCrawler()", function (done) {
        var productURL = "http://www.tesco.com/groceries/product/details/?id=255066698";
        crawler.priceSpider(productURL, "en_gb", null, "phantomjs")
            .then(function (json) {
                console.log(json);
                expect(json.status).to.equal(true);
            })
            .catch(function (err) {
                console.error(err);
            })
            .finally(function () {
                done();
            })
    })
})