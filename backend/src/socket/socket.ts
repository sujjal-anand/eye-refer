import { Server } from "socket.io";
import { joinRoom, sendMessage } from "./event";
import { Socket } from "socket.io-client";
import { ChildProcess } from "child_process";
import Messages from "../models/message";
import Notification from "../models/Notification";
export let io: Server;

export const setSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("joinchat", async (data: any) => {
      joinRoom(socket, data);
      console.log("chat joined");
    });

    socket.on("send_message", async (message: any) => {
      console.log(message);
      sendMessage(socket, message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("joinnotification", (data) => {
      console.log("joined notificatison", data?.id);
      console.log(`User ${socket.id} joined room: ${data?.id}`);
      socket.join(data?.id);
    });

    socket.on("sendNotification", async (data) => {
      console.log("Received data from client:", data);
      console.log("xxxxxx", data.room);
      console.log(`User ${socket.id}`);
      io.to(data.room).emit("notification", { message: data.message });
      await Notification.create({
        message: data.message,
        // receiver_id: parseInt(data.room),
        room_id: data.room,
      });
    });
  });
};
