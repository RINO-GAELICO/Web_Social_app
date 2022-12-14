const {requestPrint, errorPrint, successPrint} = require('../helpers/debug/debugprinters');


const routeprotectors = {};

routeprotectors.userIsLoggedIn = function(req,res,next) {

    if(req.session.username){
        successPrint('User is logged in');
        next();
    }else{
        errorPrint('User is not logged in');
        req.flash('error', 'You must be logged in to create a Post!');
        res.redirect('/login');
    }
}

module.exports = routeprotectors;