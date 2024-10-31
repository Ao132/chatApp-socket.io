import express from "express";
const app = express();
import { Server } from "socket.io";

let server = app.listen(3000);
const io = new Server(server, { cors: "*" });

let socketConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  
  socketConnected.add(socket.id);
  io.emit("total-clients", socketConnected.size);
  socket.on("chatMsg", ({ msg, date, name }) => {
    const messageData = {
      senderId: socket.id,
      msg,
      date,
      name,
    };
    io.emit("reply", messageData);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("user-typing", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    socketConnected.delete(socket.id);
    io.emit("total-clients", socketConnected.size);
  });
}
