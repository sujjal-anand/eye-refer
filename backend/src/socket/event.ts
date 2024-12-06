import doctors from "../models/Doctors";
import Chat from "../models/chat";
import { io } from "./socket";
import Room from "../models/Room";

export const joinRoom = async (socket: any, data: any) => {
  try {
    const room = await Room.findOne({
      where: {
        user_id_1: data.user1,
        user_id_2: data.user2,
        patient_id: data.patient,
      },
    });
    console.log(room);
    if (room) {
      socket.join(`room-${room.id}`);
      const chats = await Chat.findAll({
        where: { room_id: room.id },
        include: [
          {
            model: doctors,
            as: "sender",
          },
          {
            model: doctors,
            as: "receiver",
          },
          {
            model: Room,
            as: "room",
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      if (chats) {
        io.to(`room-${room.id}`).emit("prev_msg", chats);
        io.to(`room-${room?.id}`).emit("getRoom", room.id);
      } else {
        io.to(`room-${room?.id}`).emit("getRoom", room.id);
      }
    } else {
      const newRoom = await Room.create({
        name: data.roomname,
        user_id_1: data.user1,
        user_id_2: data.user2,
        patient_id: data.patient,
      });

      socket.join(`room-${newRoom.id}`);
      io.to(`room-${newRoom?.id}`).emit("getRoom", newRoom.id);
    }
  } catch (err) {
    // console.log(err);
  }
};

export const sendMessage = async (socket: any, message: any) => {
  try {
    console.log("\n\nMessage", message);
    const chat = await Chat.create({
      message: message.message,
      room_id: message.room,
      sender_id: message.sender,
      receiver_id: message.receiver,
    });

    io.to(`room-${message.room}`).emit("new_message", chat);
  } catch (err) {
    console.log(err);
  }
};
