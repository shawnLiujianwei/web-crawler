/**
 * Created by Shawn Liu on 2015/5/18.
 */
var expect = require('chai').expect;
var retailer = require("../../../components/crawler/retailer");
describe("Test retailer.js", function () {

    it("#extractRetailerId()", function (done) {
        var productURL = "http://www.tesco.com/groceries/product/details/?id=255066698";
        var locale = "en_gb";
        retailer.extractRetailerId(productURL, locale)
            .then(function (id) {
                console.log(id);
                expect(id.retailerId).to.equal("groceries.tesco.com");
            })
            .catch(function (err) {
                console.error(err);
            })
            .finally(function () {
                done();
            })
    })
})