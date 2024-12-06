import express from "express";
import sequelize from "./config/database";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/router";
import { createServer } from "http";
import { setSocket } from "./socket/socket";
import chatrouter from "./chat_routes/routes";
import { Local } from "./env/config";
export const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/users", userRoutes);
export const httpServer = createServer(app);
setSocket(httpServer);
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Database connected");

    httpServer.listen(Local.Port, () => {
      console.log(`Server is running on port ${Local.Port}`);
    });
  })
  .catch((err: any) => {
    console.log("Error: ", err);
  });
//hello
