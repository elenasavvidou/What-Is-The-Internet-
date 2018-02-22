const express = require('express');
const app = express();
const db = require("./db.js")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const knox = require('knox');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const s3= require('./s3');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())
app.use(express.static("./public"));
app.use(express.static("uploads"));

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

/***** GET IMAGES *****/
app.get('/images', function (req, res) {
    db.getRecentImages().then(results => {
        console.log(results);
        res.json(results);
    });
});

/***** POST UPLOAD *****/
app.post('/upload', uploader.single('file'), function(req, res) {

    if (req.file) {
        s3.upload(req.file).then((results)=>{
            console.log("is it working?", req.file.filename)

            db.userImageToDatabase(req.file.filename, req.body.username, req.body.title, req.body.description).then(()=>{
                res.json({success: true})
            })
        })
    };
});

/***** GET INFO FROM SINGLE IMAGE *****/
app.get('/info/images/:imageId', (req,res)=> {
    db.getSingleImageInfo(req.params.imageId).then(data => {
        console.log("results from getting singleimage info:", data.rows);
        res.json(data.rows[0]);
    });
});

/***** GET COMMENTS *****/
app.get('/info/comments/:imageId', (req, res) => {
    db.getCommentsOnImages(req.params.imageId).then(data => {
        console.log("results from getCommentsOnImages:", data.rows);
        res.json(data.rows);
    })
})

app.post('/info/comments/:imageId', (req, res) => {
    console.log("inside post/info/comments", req.params.imageId, req.body.author, req.body.comments);
    db.postCommentsOnImages(req.params.imageId, req.body.author, req.body.comments)
    .then(data => {
        console.log("WHAT HAPPENS:", req.body.author);
        console.log("results form postComentsOnImages:", data);
        res.json(data);
    })
})

/***** *****/
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})
app.listen(8080, () => console.log("Listening!"));
