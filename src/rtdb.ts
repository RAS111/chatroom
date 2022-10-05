import firebase from "firebase";
const app = firebase.initializeApp({
    apiKey: "8jwP1BqKGlb04CZrYXqSvyCFD1BJpgf6UTskJPtU",
    authDomain: "dwf-m6-chatroom.firebaseio.com",
    databaseURL: "https://dwf-m6-chatroom-default-rtdb.firebaseio.com",
    projectId: "dwf-m6-chatroom",
});

const rtdb = firebase.database();

export { rtdb };