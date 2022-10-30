var express = require('express');
var router = express.Router();
const db = require('../Db/database');
const UserModel = require('../models/Users');
const {requestPrint, errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const UserError = require("../helpers/error/UserError");
var bcrypt = require('bcrypt');
const {usernameValidation, emailValidation, passwordValidation, loginValidation} = require('../middleware/validation');


router.post('/register',usernameValidation, emailValidation, passwordValidation, (req, res, next) => {
    let password = req.body.password;
    let username = req.body.username;
    let Email = req.body.Email;
    let Confirm_Password = req.body.Confirm_Password;

    UserModel.usernameExists(username)
    .then((usernameDoesExits) => {
        if(usernameDoesExits){
            throw new UserError(
                "Registration failed: Username already exists",
                "/registration",
                200
            );
        }else{
            return UserModel.emailExists(Email);
        }
    })
    .then((emailDoesExists) => {
        if(emailDoesExists){
            throw new UserError(
                "Registration failed: Email already exists",
                "/registration",
                200
            );
        }else{
            return UserModel.create(username, password, Email);
        }
    })
    .then((createUserId)=>{
        if(createUserId < 0){
            throw new UserError(
                "Server Error: user could not be created",
                "/registration",
                500
            );
        }else{
            successPrint("User.js --> User was created");
            req.flash('success', 'User account has been created');
            res.redirect('/login');
        }
    })
    .catch((err) => {
        errorPrint("User could not be made", err);

        req.flash('error', 'Error: user could not be created');
        req.session.save(err => {

            res.redirect("/registration");
        });

        if (err instanceof UserError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }

    })
});

router.post('/login', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;
    // let sqlCommand = "SELECT id,username, password FROM users WHERE username = ?"
    // let userId;
    //
    // db.execute(sqlCommand, [username])
    //     .then(([results, fields]) => {
    //
    //         if (results && results.length == 1) {
    //             let hashedPassword = results[0].password;
    //             userId = results[0].id;
    //             return bcrypt.compare(password, hashedPassword);
    //
    //
    //         } else {
    //             throw new UserError("Invalid Username or Password", '/login', 200);
    //         }
    //
    //     })

    UserModel.authenticate(username,password)
        .then((loggedUserId) => {
            if (loggedUserId > 0) {

                successPrint(`User ${username} is logged is logged in`);

                req.session.username = username;
                req.session.userId = loggedUserId;
                res.locals.logged = true;
                res.locals.username = username;
                req.flash('success', 'You have successfully logged in');
                req.session.save(err => {res.redirect('/')});
                // res.redirect('/');
            } else {
                throw new UserError("Invalid Username or Password", '/login', 200);
            }

        })
        .catch((err) => {
            errorPrint("user login failed")
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect('/login');
            } else {
                next(err);
            }

        });


});

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint(err.getMessage());
            next(err);
        } else {
            successPrint('Session was destroyed');

            res.clearCookie('csID');
            req.session = null;
            res.locals.logged = false;
            res.json({status: "Ok", message: "user is logged out"});
            res.redirect('/');
        }

    })
});


module.exports = router;
