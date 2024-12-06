import Chats from "../models/chat";
import { Request, response, Response } from "express";
import Messages from "../models/message";
import { Op } from "sequelize";

export const addchats = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { chatroomname } = req.body;

    console.log("Request Body:", req.body);
    console.log("Chatroom Name:", chatroomname);

    // Assuming the id is formatted as "senderid-receiverid"
    const senderid = id.split("")[0];
    const receiverid = id.split("")[2];

    // Check if the chat room already exists to prevent duplicates
    let chatRoom = await Chats.findOne({
      where: {
        senderid,
        receiverid,
        roomname: chatroomname,
      },
    });

    // If the chat room doesn't exist, create a new one
    if (!chatRoom) {
      chatRoom = await Chats.create({
        senderid,
        receiverid,
        roomname: chatroomname,
      });
      console.log("New chat room created:", chatRoom);
    } else {
      console.log("Chat room already exists:", chatRoom);
    }

    // Return success response with the chat room details
    res
      .status(200)
      .json({ message: "Chat room processed successfully", chatRoom });
  } catch (error) {
    console.error("Error in addchats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addmessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("iffff", id);
    const chatRoom = await Chats.findOne({ where: { id: id } });
    if (chatRoom) {
      const { messagesend, sendername } = req.body;
      const response = Messages.create({
        roomid: id,
        message: messagesend,
        sendername,
      });
      res.status(200).json(response);
    } else {
      console.log("room doesnt exists");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getchats = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await Messages.findAll({
    where: { roomid: id },
  });

  res.status(200).json(response);
};

export const getrooms = async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log(req.body);
  const response = await Chats.findAll({
    where: {
      [Op.or]: [
        {
          senderid: id,
        },
        {
          receiverid: id,
        },
      ],
    },
    include: [
      {
        model: Messages,
      },
    ],
  });

  res.status(200).json(response);
};
