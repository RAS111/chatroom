import * as admin from "firebase-admin";
var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: "https://dwf-m6-chatroom-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const rtdb = admin.database();

export { db, rtdb };