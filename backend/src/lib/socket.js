import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: ["http://localhost:5173"],
    },
});


export function getReciverSocketId(userId){
    return userSocketmap[userId];
}

//used to store online users
const userSocketmap={} // {userId:socketId}

io.on("connection",(socket)=>{
    console.log("a user connected",socket.id);

    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketmap[userId]=socket.id;
    }

//io.emit() is used to send event to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketmap));

    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id);
        delete userSocketmap[userId];
    });

});

export {io,server,app};