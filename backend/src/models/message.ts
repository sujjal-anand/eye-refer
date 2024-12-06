// Messages Model
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Chats from "./chat";

class Messages extends Model {
  public id!: number;
  public roomid!: number;
  public message!: string;
  public sendername!: string;
}

Messages.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    // roomid: {
    //   type: DataTypes.INTEGER.UNSIGNED,
    // },
    sendername: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "hd",
    },
    message: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "Messages",
  }
);

Chats.hasMany(Messages, {
  foreignKey: "roomid",
});
Messages.belongsTo(Chats, {
  foreignKey: "roomid",
});

export default Messages;
