var express = require('express');

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();
// Once you’ve created a router object, you can add middleware and HTTP method routes (such as get, put, post, and so on) to it just like an application.

const db = require('../Db/database');
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const {getRecentPosts, getPostById, getCommentByPostId} = require('../middleware/postsmiddleware');


/*
The app.get() method specifies a callback function that will be invoked whenever there is an HTTP GET request with a path ('/') relative to the site root
 */
/* GET home page. */
router.get('/',getRecentPosts, function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Duccio Rocca" ,  nav: [
      // in topnav partials :
      // {{#each nav}}
      //     <a href="{{url}}">{{title}}</a>
      // {{/each}}
          // that's why we have {{url}} : {{title}} here
      { url: "/registration", title: "Registration" },
      { url: "/post", title: "Post" },
      { url: "/view", title: "View" }
    ]  });
});

 // here for the route login there is no callback function
router.get('/login', (req,res,next) => {
  res.render('LoginPage', { title: 'Login' , nav: [
      { url: "/registration", title: "Registration" },
      { url: "/post", title: "Post" },
      { url: "/view", title: "View" },
      { url: "/", title: "Home" },
    ] , login:true });
});


router.get('/registration', (req,res,next) =>{
  res.render('Registration', { title: 'Registration' , nav: [

      { url: "/post", title: "Post" },
      { url: "/view", title: "View" },
          { url: "/", title: "Home" }

    ]});
});

router.get('/view', (req,res,next) =>{
  res.render('ViewImage', { title: 'View', nav: [

    { url: "/registration", title: "Registration" },
    { url: "/post", title: "Post" },
          { url: "/", title: "Home" }

  ]});
});

router.use('/post', isLoggedIn);

router.get('/post', (req,res,next) =>{
  res.render('PostImage', { title: 'Post' , nav: [

      { url: "/registration", title: "Registration" },
      { url: "/view", title: "View" },
          { url: "/", title: "Home" }

    ]});
});

/*
Routes allow you to match particular patterns of characters in a URL,
and extract some values from the URL and pass them as parameters to the route handler
(as attributes of the request object passed as a parameter).
 */

router.get('/post/:id(\\d+)', getPostById, getCommentByPostId,(req,res,next)=>{
    // see the comment above for the req.params.id
    res.render('ViewImage', { title: `Post ${req.params.id}`});
});


/*
To make objects available outside of a module
you just need to expose them as additional properties on the exports object.
BUT
If you want to export a complete object in one assignment instead of building it one property at a time,
assign it to module.exports as shown below
 */
module.exports = router;
