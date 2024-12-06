import { Router } from "express";

import {
  addchats,
  addmessages,
  getchats,
  getrooms,
} from "../chat_controllers/Chatcontroller";

const chatrouter = Router();

chatrouter.post("/save/:id", addchats);
chatrouter.post("/message/:id", addmessages);
chatrouter.get("/get/:id", getchats);
chatrouter.post("/getrooms", getrooms);

export default chatrouter;
