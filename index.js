const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(express.static("./public"));
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
//makes upload possible
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.json());

app.get("/modal/:id", (req, res) => {
    var id = req.params.id;
    db.getImageForModal(id).then(function(results) {
        db.getComments(id).then(data => {
            var jointresponse = {};
            jointresponse.image = results;
            jointresponse.comments = data;

            res.json(jointresponse);
        });
    });
});
app.get("/candy", (req, res) => {
    // res.json([
    //     { name: "maltesers" },
    //     { name: "happy cherries" },
    //     { name: "milka" }
    // ]);
    // console.log("res: ", res);
    db.getImages().then(function(results) {
        res.json(results.rows);
        // console.log(results);
    });
});
app.post("/sendcomment/:commenttext/:commentername/:id/", (req, res) => {
    console.log(req.params);
    var thisModal = req.params;
    db.postComment(
        thisModal.commentername,
        thisModal.commenttext,
        thisModal.id
    ).then(data => res.json(data));
});
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const body = req.body;
    //insert a new row into the database for the image
    //the url for the image is https://s3.amazonaws.com/:yourBucketName/:filename.
    const imageUrl = s3Url + req.file.filename;
    //after query is successful, send a response
    db.logImages(imageUrl, body.username, body.title, body.description).then(
        data => res.json(data)
    );

    //unshift() puts an image in the beginning unlike push.
});

app.post("/loadmore/:id", (req, res) => {
    console.log(req.params.id);
    db.getNext(req.params.id).then(data => res.json(data));
});

app.post("sendprev/:id", (req, res) => {
    console.log("this happened");
    console.log(req.params.id);
    db.getprevim(req.params.id).then(function(results) {
        console.log(results);
        res.json(results);
    });
});

app.listen(8080, () => console.log(`808(0) listening.`));
