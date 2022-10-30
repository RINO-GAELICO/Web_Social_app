const db = require("../Db/database");
const UserError = require("../helpers/error/UserError");
const bcrypt = require("bcrypt");
const {successPrint, errorPrint} = require("../helpers/debug/debugprinters");


const checkUsername = (username) => {

    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);
};

const checkEmail = (email) => {
    let emailChecker = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return emailChecker.test(email);
};

const checkPassword = (password) => {
    let passwordChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\/*-+!@#$^&*])[A-Za-z\d\/*-+!@#$^&*]{8,}$/;
    return passwordChecker.test(password);
};

const usernameValidation = (req, res, next) => {
    let username = req.body.username;
    if (!checkUsername(username)) {

        req.flash('error', 'Invalid username');
        req.session.save(err => {

            res.redirect("/registration");
        });
    } else {
        next();
    }
};

const loginValidation = (req, res, next) => {

    let password = req.body.password;
    let username = req.body.username;
    let Email = req.body.Email;
    let Confirm_Password = req.body.Confirm_Password;

    db.execute('SELECT * FROM users WHERE username=?', [username])
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return db.execute('SELECT * FROM users WHERE Email=?', [Email]);
            } else {

                throw new UserError(
                    "Registration failed: Username already exists",
                    "/registration",
                    200
                );
            }
        })
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return bcrypt.hash(password, 10);
            } else {
                // req.flash('error','Registration failed: Email already exists');
                // req.session.save(err => {
                //
                //     res.redirect("/registration");
                // });
                throw new UserError(
                    "Registration failed: Email already exists",
                    "/registration",
                    200
                );
            }
        })
        .then((hashedPassword) => {

            let sqlCommand = "INSERT INTO users (username, Email, password, creationTime) VALUES (?,?,?,now())";
            return db.execute(sqlCommand, [username, Email, hashedPassword]);


        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                successPrint("User.js --> User was created");
                req.flash('success', 'User account has been created');
                res.redirect('/login');
            } else {
                // req.flash('error','Server Error: user could not be created');
                // req.session.save(err => {
                //
                //     res.redirect("/registration");
                // });
                throw new UserError(
                    "Server Error: user could not be created",
                    "/registration",
                    500
                );
            }
        })
        .catch((err => {
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
        );
};

const emailValidation = (req, res, next) => {
    let email = req.body.Email;

    if (!checkEmail(email)) {

        req.flash('error', 'Invalid email');
        req.session.save(err => {

            res.redirect("/registration");
        });
    } else {
        next();
    }
};
const passwordValidation = (req, res, next) => {
    let password = req.body.password;
    let confirmPass = req.body.Confirm_Password;

    if (!checkPassword(password)) {

        req.flash('error', 'Invalid password');
        req.session.save(err => {

            res.redirect("/registration");
        });
    } else {
        if (password === confirmPass) {
            next();
        } else {
            req.flash('error', "Passwords don't match");
            req.session.save(err => {

                res.redirect("/registration");
            });
        }

    }
};

const postValidation = (req, res, next) => {
    let title = req.body.Post_Title;
    let description = req.body.Post_Description;
    let fk_userId = req.session.userId;
    let fileUploaded = req.file.path;

    if (fileUploaded == null) {
        req.flash('error', 'Invalid File');
        req.session.save(err => {

            res.redirect("/post");
        });
    } else {


        if (title == null) {
            req.flash('error', 'Invalid Title');
            req.session.save(err => {

                res.redirect("/post");
            });
        } else {
            if (description == null) {
                req.flash('error', 'Invalid Description');
                req.session.save(err => {

                    res.redirect("/post");
                });
            } else {
                if (fk_userId == null) {
                    req.flash('error', 'Invalid UserId');
                    req.session.save(err => {

                        res.redirect("/post");
                    });
                } else {
                    next();
                }
            }

        }
    }
};

module.exports = {usernameValidation, emailValidation, passwordValidation, loginValidation, postValidation};

