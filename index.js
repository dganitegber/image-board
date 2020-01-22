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
    console.log("req.params.id", req.params.id);
    console.log("id", id);
    db.getImageForModal(id).then(function(results) {
        res.json(results.rows[0]);
        console.log("results for modal", results.rows[0]);
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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const body = req.body;
    //insert a new row into the database for the image
    //title, description, username are in req.body
    //the url for the image is https://s3.amazonaws.com/:yourBucketName/:filename.
    const imageUrl = s3Url + req.file.filename;
    console.log(imageUrl);
    console.log("body", body);
    //after query is successful, send a response
    db.logImages(imageUrl, body.username, body.title, body.description).then(
        data => res.json(data)
    );

    //unshift() puts an image in the beginning unlike push.
});

app.listen(8080, () => console.log(`808(0) listening.`));
