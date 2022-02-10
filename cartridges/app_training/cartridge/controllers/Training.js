'use strict';
 
var server = require('server');
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Transaction = require("dw/system/Transaction");


server.get('HelloWorld', function (req, res, next) {
    var myvariable = "Just a string"
    res.render("training/myfirsttemplate", { myvariable: myvariable });
    return next();
}); 

 
server.get('Basket', function (req, res, next) {
    var BasketMgr = require("dw/order/BasketMgr");
 
    var currentBasket = BasketMgr.getCurrentBasket();
 
    res.render("training/showBasket", {Basket: currentBasket});
    return next();
    // Use ISML to display Basket object
    // The rendered ISML should be showBasket.isml (Use the quickcard section "Giving control to ISML" for help)
});
server.get("Show", consentTracking.consent, server.middleware.https, csrfProtection.generateToken, function(
    req,
    res,
    next
) {
    var URLUtils = require("dw/web/URLUtils");
    var Resource = require("dw/web/Resource");

    var profileForm = server.forms.getForm("training");
    profileForm.clear();

    res.render("trainingform", {
        title: Resource.msg("training.form.title.submit", "forms", null),
        profileForm: profileForm,
        actionUrl: URLUtils.url("Training-SubmitRegistration").toString()
    });

    next();
});

server.post(
    "SubmitRegistration",
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function(req, res, next) {
        var Resource = require("dw/web/Resource");
        var URLUtils = require("dw/web/URLUtils");
        var profileForm = server.forms.getForm("training");

        
        var id = profileForm.customer.email.value;
        var firstname = profileForm.customer.firstname.value;
        var lastname = profileForm.customer.lastname.value;
        var object = CustomObjectMgr.getCustomObject("NewsletterSubscription", id);
        if (!object) {
            // Remember, object creation, modification and deletion must be done inside transactions
            Transaction.wrap(function () {
                object = CustomObjectMgr.createCustomObject("NewsletterSubscription", id);
                object.custom.firstName = firstname;
                object.custom.lastName = lastname;
            }
            )
        }   

        res.render("trainingform", {
            title: Resource.msg("training.form.title.edit", "forms", null),
            profileForm: profileForm,
            actionUrl: URLUtils.url("Training-SubmitRegistration").toString()
        });

        next();
    }
);


module.exports = server.exports();