'use strict';
 
var server = require('server');
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var CustomObjectMgr = require("dw/object/CustomObjectMgr");
var Transaction = require("dw/system/Transaction");
 
server.get("Show", consentTracking.consent, server.middleware.https, csrfProtection.generateToken, function(
    req,
    res,
    next
) {
    var URLUtils = require("dw/web/URLUtils");
    var Resource = require("dw/web/Resource");

    var profileForm = server.forms.getForm("myForm");
    profileForm.clear();

    res.render("myform", {
        title: Resource.msg("myForm.form.title.submit", "forms", null),
        profileForm: profileForm,
        actionUrl: URLUtils.url("CustomForm-SubmitRegistration").toString()
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
        var profileForm = server.forms.getForm("myForm");

        var firstname = profileForm.customer.firstname.value;
        var lastname = profileForm.customer.lastname.value;
        var email = profileForm.customer.email.value;
        var age = profileForm.customer.age.value;
        var student = profileForm.customer.isstudent.value;
        //var address = profileForm.cusomer.addressId;

        var object = CustomObjectMgr.getCustomObject("Newsletter", email);
        if (!object) {
            // Remember, object creation, modification and deletion must be done inside transactions
            Transaction.wrap(function () {
                object = CustomObjectMgr.createCustomObject("Newsletter", email);
                object.custom.firstName = firstname;
                object.custom.lastName = lastname;
                object.custom.age = age;
                object.custom.isStudent = student;
            }
            )
        }
        
        res.render("myform", {
            title: Resource.msg("myForm.form.title.edit", "forms", null),
            profileForm: profileForm,
            actionUrl: URLUtils.url("CustomForm-SubmitRegistration").toString()
        });

        next();
    }
);


module.exports = server.exports();