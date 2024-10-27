import express from "express";
const app = express();
import { Server } from "socket.io";

let server = app.listen(3000);
const io = new Server(server, { cors: "*" });

io.on("connection", onConnected);

function onConnected(socket) {
  console.log("user connected", socket.id);
  socket.on("chatMsg", (msg) => {
    const messageData = {
      senderId: socket.id,
      msg: msg,
    };
    io.emit("reply", messageData);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
}
