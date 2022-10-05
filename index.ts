import * as express from "express";
import { db, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static("dist"))
app.use(express.json());
app.use(cors());

const userCollection = db.collection("users");
const roomsCollection = db.collection("rooms");

app.post("/signup", (req, res) => {
    const { email } = req.body;
    const { nombre } = req.body;
    userCollection
        .where("email", "==", email)
        .get()
        .then((searchResponse) => {
            if (searchResponse.empty) {
                userCollection
                    .add({
                        email,
                        nombre,
                    })
                    .then((newUserRef) => {
                        res.json({
                            id: newUserRef.id,
                            new: true,
                        });
                    });
            } else {
                res.status(404).json({
                    message: "user already exist",
                });
            }
        });
});

app.post("/auth", (req, res) => {
    const { email } = req.body;
    userCollection
        .where("email", "==", email)
        .get()
        .then((searchResponse) => {
            if (searchResponse.empty) {
                res.status(404).json({
                    message: "user not found",
                });
            } else {
                res.json({
                    id: searchResponse.docs[0].id,
                });
            }
        });
});

app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    userCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
            if (doc.exists) {
                const roomRef = rtdb.ref("rooms/" + uuidv4());
                roomRef
                    .set({
                        messages: [],
                        owner: userId,
                    })
                    .then(() => {
                        const roomLongId = roomRef.key;
                        const roomId = 1000 + Math.floor(Math.random() * 999);
                        roomsCollection
                            .doc(roomId.toString())
                            .set({
                                rtdbRoomId: roomLongId,
                            })
                            .then(() => {
                                res.json({
                                    id: roomId.toString(),
                                });
                            });
                    });
            } else {
                res.status(401).json({
                    message: "no existe",
                });
            }
        });
});

app.get("/rooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    
    userCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
            if (doc.exists) {
                roomsCollection
                    .doc(roomId)
                    .get()
                    .then((snap) => {
                        const data = snap.data();
                        res.json(data);
                    });
            } else {
                res.status(401).json({
                    message: "no existe",
                });
            }
        });
});

app.post("/messages", function (req, res) {
    const { roomId } = req.body;
    const { message } = req.body;
    const { fullName } = req.body;

    roomsCollection.doc(roomId).get().then(snap => {
        const rtdbId = snap.data();
        const chatRoomRef = rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/messages");
        chatRoomRef.push({
            message,
            fullName
        }, () => res.json("todo ok"));
    })

});

app.get("*", function(req, res){
    res.sendFile(__dirname + "/dist/index.html");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
