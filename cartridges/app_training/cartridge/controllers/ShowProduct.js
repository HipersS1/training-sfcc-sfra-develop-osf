'use strict';
 
var server = require('server');
 
 
server.get('Start', function (req, res, next) {

    var ProductMgr = require("dw/catalog/ProductMgr");
    var myProduct = ProductMgr.getProduct("P0048M");
    res.render("training/productfound", {myProduct: myProduct});
    return next();
});

server.get('Show', function (req, res, next) {
    var ProductMgr = require("dw/catalog/ProductMgr");

    var productId = req.querystring.pid;
    var myProduct = ProductMgr.getProduct(productId);
    
    res.render("training/productfound", {myProduct: myProduct});
    return next();
});


server.get('RenderTemplate', function (req, res, next) {

    res.render("training/dummyText");
    return next();
});

server.get('TestRemoteInclude', function (req, res, next) {

    res.render("training/remoteDummyText");
    return next();
});

server.get('TestDecorator', function (req, res, next){
    res.render('training/decoratorTemplate');
    return next();
});

server.get('CustomTag', function (req, res, next){
    res.render('components/content/contentAsset', {pid: "text"});
    return next();
});


module.exports = server.exports();