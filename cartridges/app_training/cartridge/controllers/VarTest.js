'using strict';

var server = require('server');
 
 
server.get('Var', function (req, res, next) {
    var myvariable = "Another string";
    res.render("training/vartest", {string: "dgdfgd"});
    return next();
}); 

module.exports = server.exports();