"use strict";
exports.__esModule = true;
exports.rtdb = exports.db = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dwf-m6-chatroom-default-rtdb.firebaseio.com"
});
var db = admin.firestore();
exports.db = db;
var rtdb = admin.database();
exports.rtdb = rtdb;
