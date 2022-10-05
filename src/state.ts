import {rtdb} from "./rtdb";
import { map } from "lodash";


const API_BASE_URL = "https://dwf-m6-prueba.herokuapp.com";
const state = {
    data: {
        email:"",
        fullName: "",
        userId: "",
        roomId: "",
        messages: [], 
        rtdbRoomId: "",
    },
    listener: [],
    init(){
        const lastStorageState = localStorage.getItem("state");
    },
    listenRoom(){
        const cs = this.getState();
        const chatRoomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

        chatRoomsRef.on("value", (snapshot) => {
            const messagesFromServer = snapshot.val();
            const messagesList = map(messagesFromServer.messages);
            cs.messages = messagesList;
            this.setState(cs);
        });
    },
    getState() {
        return this.data;
    },
    setMessage(message:String) {
        const cs = this.getState();
        cs.messages.push({message, fullName: cs.fullName});
    },
    pushMessage(message: string) {
        const cs = this.getState();
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                fullName: cs.fullName,
                message: message,
                roomId: cs.roomId,
            })
        });
    },
    setRoomId(roomId:string){
        const cs = this.getState();
        cs.roomId = roomId
        this.setState(cs);
    },
    setEmailAndFullname(email: string, fullName: string ) {
        const cs = this.getState();
        cs.fullName = fullName;
        cs.email = email;
        this.setState(cs);
    },
    signIn(callback) {
        const cs = this.getState();
        if(cs.email){
            fetch(API_BASE_URL + "/auth", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({email: cs.email, name: cs.fullName})
            }).then(res => {
                return res.json();
            }).then(data => {
                cs.userId = data.id;
                this.setState(cs);
                callback();
            });
        } else {
            console.error("no hay un email en el state");
            callback(true);
        }
    },
    askNewRoom(callback?) {
        const cs = this.getState();
        if(cs.userId) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({userId: cs.userId})
            }).then(res => {
                return res.json();
            }).then(data => {
                cs.roomId = data.id;
                this.setState(cs);
                if(callback) {
                    callback();
                }   
            });
            console.log(cs.userId);
        } else {
            console.error("no hay user id");
        }
    },
    setState(newState) {
        this.data = newState;
        for(const cb of this.listener){
            cb();
        }
        localStorage.setItem("state", JSON.stringify(newState));
        console.log(this.data);
    },
    accessToRoom(callback?) {
        const cs = this.getState();
        const roomId = cs.roomId;
        const userId = cs.userId;
        fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId).then(res => {
            return res.json();
        }).then(data => {
            cs.rtdbRoomId = data.rtdbRoomId;
            this.setState(cs);
            this.listenRoom();
            if(callback) {
                callback();
            }   
        });
    },
    subscribe(callback: (any) => any) {
        this.listener.push(callback);
    },
}

export { state };