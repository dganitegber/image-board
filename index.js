const express = require("express");
const app = express();
const db = require("./db");

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

app.get("/candy", (req, res) => {
    // res.json([
    //     { name: "maltesers" },
    //     { name: "happy cherries" },
    //     { name: "milka" }
    // ]);
    // console.log("res: ", res);
    db.getImages().then(function(results) {
        res.json(results.rows);
        console.log(results);
    });
});

app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("file: ", req.file);
    console.log("input: ", req.body);
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, () => console.log(`808(0) listening.`));
