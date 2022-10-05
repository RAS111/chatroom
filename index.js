"use strict";
exports.__esModule = true;
var express = require("express");
var db_1 = require("./db");
var uuid_1 = require("uuid");
var cors = require("cors");
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
var userCollection = db_1.db.collection("users");
var roomsCollection = db_1.db.collection("rooms");
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var nombre = req.body.nombre;
    userCollection
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            userCollection
                .add({
                email: email,
                nombre: nombre
            })
                .then(function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    "new": true
                });
            });
        }
        else {
            res.status(404).json({
                message: "user already exist"
            });
        }
    });
});
app.post("/auth", function (req, res) {
    var email = req.body.email;
    userCollection
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            res.status(404).json({
                message: "user not found"
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    userCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            var roomRef_1 = db_1.rtdb.ref("rooms/" + uuid_1.v4());
            roomRef_1
                .set({
                messages: [],
                owner: userId
            })
                .then(function () {
                var roomLongId = roomRef_1.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomsCollection
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: roomLongId
                })
                    .then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "no existe"
            });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    userCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            roomsCollection
                .doc(roomId)
                .get()
                .then(function (snap) {
                var data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                message: "no existe"
            });
        }
    });
});
app.post("/messages", function (req, res) {
    var roomId = req.body.roomId;
    var message = req.body.message;
    var fullName = req.body.fullName;
    roomsCollection.doc(roomId).get().then(function (snap) {
        var rtdbId = snap.data();
        var chatRoomRef = db_1.rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/messages");
        chatRoomRef.push({
            message: message,
            fullName: fullName
        }, function () { return res.json("todo ok"); });
    });
});
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
