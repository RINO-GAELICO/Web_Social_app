const createError = require("http-errors");
/*
how we import a module by nam (take the Express framework as an example)
First we invoke the require() function, specifying the name of the module as a string ("express"),
and calling the returned object to create an Express application.
We can then access the properties and functions of the application object.
 */
// (import) the express module
const express = require("express");
const favicon = require('serve-favicon');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
var commentRouter = require('./routes/comments');

// importing other modules and packages
const cors = require("cors");
const {requestPrint, errorPrint, successPrint} = require('./helpers/debug/debugprinters');
const db = require('./Db/database');
var sessions = require('express-session');
var sqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');

// rename express object as app
// this object has methods for routing HTTP requests,
// configuring middleware, rendering HTML views,
// registering a template engine,
// and modifying application settings that control how the application behaves
// (e.g. the environment mode, whether route definitions are case sensitive, etc.)
const app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
        partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
        extname: ".hbs", //expected file extension for handlebars files
        defaultLayout: "layout", //default layout for app, general template for all pages in app
        helpers: {
            emptyObject : (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0);
            }

        }, //adding new helpers to handlebars for extra functionality
    })
);

var mysqlSessionStore = new sqlSession({ /* default options */}, require('./Db/database'));

app.use(sessions({
    key:"csID",
    secret:"this is a secret from cs317",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false

}));

app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//Concise output colored by response status for development use.
// The :status token will be colored green for success codes, red for server error codes,
// yellow for client error codes, cyan for redirection codes, and uncolored for information codes.
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use((req,res,next) => {
    if(req.session.username){

        res.locals.logged = true;
        res.locals.username = req.session.username;

    }
    next();
});

app.use((req, res, next) => {
    requestPrint(`Method: ${req.method}, Route: ${req.url}, Session username: ${req.session.username}`);
    next();
});

app.use(cors());



/*
A router object is an isolated instance of middleware and routes.
You can think of it as a “mini-application,” capable only of performing middleware and routing functions.
Every Express application has a built-in app router.
A router behaves like middleware itself, so you can use it as an argument to app.use() or as the argument to another router’s use() method.
 */

app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js
app.use("/posts", postsRouter); // route middleware from ./routes/posts.js
app.use('/comments', commentRouter); // route middleware from ./routes/comments.js




/**
 * Catch all route, if we get to here then the
 * resource requested could not be found.
 */
app.use((req, res, next) => {
    next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})


/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = err;
    errorPrint(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});


/*
To make objects available outside of a module
you just need to expose them as additional properties on the exports object.
BUT
If you want to export a complete object in one assignment instead of building it one property at a time,
assign it to module.exports as shown below
 */
module.exports = app;
