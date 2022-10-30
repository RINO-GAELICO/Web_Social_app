var express = require('express');
var db = require('../Db/database');

var router = express.Router();

const {requestPrint, errorPrint, successPrint} = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError');
const {postValidation} = require('../middleware/validation');
var PostModel = require("../models/Posts");

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/images/uploads");
    },
    filename: function(req, file,cb){
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null,`${randomName}.${fileExt}`);

    }
});

var uploader = multer({storage: storage});



/* GET users listing. */
router.get('/', function(req, res, next) {

    db.query("SELECT * FROM posts")
        .then(([results,fields])=>{
        res.json(results);
    })
        .catch(err => res.json(err))


});

/*
Here we have an example of an asynchronous API
Asynchronous API is one in which the API will start an operation and immediately return (before the operation is complete).
Once the operation finishes, the API will use some mechanism to perform additional operations.
 */
router.get('/:id(\\d+)', async function (req, res, next) {
    let _id = req.params.id;

    try{
        let [results, fields] = await db.query('SELECT * FROM posts WHERE postId = ?',[_id]);
        res.json(results);
    }catch(error){
        res.json(error);
    }

});

router.post('/createPost',uploader.single("Image-File"), postValidation, (req,res,next) =>{
    let fileUploaded = req.file.path;
    // fileUploaded = "/../"+fileUploaded;
    let fileAsThumbNail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbNail;
    let title = req.body.Post_Title;
    let description = req.body.Post_Description;
    let fk_userId = req.session.userId;


    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(()=>{
            return PostModel.create(title,description,fileUploaded,destinationOfThumbnail,fk_userId);
        })
        .then((postWasCreated)=>{
            if(postWasCreated){
                req.flash('success', "Your Post was created successfully!");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created!!', '/post', 200);
            }
        })
        .catch((err) =>{
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }

        })

});


router.get('/search', async (req,res,next) =>{

   try{
    let searchTerm = req.query.search;
    if(!searchTerm){
        res.send({
            message: "No search term given",
            results: []
        });
    }else {
        let results = await PostModel.search(searchTerm);
            if (results.length) {
                res.send({
                    message: `${results.length} results found`,
                    results: results
                });
            } else {
                let [results,fields] = await db.query('select postId, title, postText, thumbnail, creationTime FROM posts ORDER BY creationTime DESC LIMIT 10', []);
                        res.send({
                            results: results,
                            message: "No results were found for your search but here are the 10 most recent posts"
                        });
                    }
            }
        } catch(err){
       next(err);
       }
    });


/*
To make objects available outside of a module
you just need to expose them as additional properties on the exports object.
BUT
If you want to export a complete object in one assignment instead of building it one property at a time,
assign it to module.exports as shown below
 */
module.exports = router;
