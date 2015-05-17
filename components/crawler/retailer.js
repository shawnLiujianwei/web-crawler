/**
 * Created by Shawn Liu on 15-5-15.
 */

var Promise = require("bluebird");
var logger = require("node-config-logger").getLogger("components/crawler/retailer.js");
var _ = require("lodash");
exports.extractDomain = function (site, productUrl) {
    return new Promise(function (resolve, reject) {
        resolve(site);
    })
}


exports.getSelector = function (locale, retailerId) {
    return new Promise(function (resolve, reject) {
        var localeConfig = _.find(staticData, {"locale": locale});
        if (!localeConfig) {
            reject("unknown locale '%s'", locale);
        } else {
            var retailer = _.find(localeConfig.retailers, {"domain": retailerId});
            if (!retailer) {
                reject("unknown retailer '%s'", retailerId);
            } else {
                resolve(_.cloneDeep(retailer.selectors));
            }
        }
    });
}

var staticData = [{
    "locale": "en_gb",
    "retailers": [
        {
            "domain": "groceries.asda",
            "id": "groceries.asda",
            "selectors": [
                {
                    "selectorType": "css",
                    "content": '#itemDetails > div.add-holder.pharmRestricted-holder > p.prod-price > span.prod-price-inner',
                    "field": "price_now",
                    "scrapeType": "text"
                },
                {
                    "selectorType": "css",
                    "content": "#itemDetails > h1",
                    "field": "name",
                    "scrapeType": "text"
                }
            ]
        },{
            "domain": "tesco.com",
            "id": "tesco.com",
            "selectors": [
                {
                    "selectorType": "css",
                    "content": 'span.linePrice',
                    "field": "price_now",
                    "scrapeType": "text"
                },
                {
                    "selectorType": "css",
                    "content": "div.desc > h1 > span",
                    "field": "name",
                    "scrapeType": "text"
                }
            ]
        }
    ]
}]