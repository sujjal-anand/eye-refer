import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import doctors from "./Doctors";
import Room from "./Room";

class Chat extends Model {
  public id!: number;
  public room_id!: number;
  public sender_id!: number;
  public receiver_id!: number;
  public message!: string;
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Chat",
  }
);

// Associations
doctors.hasMany(Chat, {
  foreignKey: "sender_id",
  as: "sentMessages",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Chat.belongsTo(doctors, {
  foreignKey: "sender_id",
  as: "sender",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

doctors.hasMany(Chat, {
  foreignKey: "receiver_id",
  as: "receivedMessages",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Chat.belongsTo(doctors, {
  foreignKey: "receiver_id",
  as: "receiver",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Room.hasMany(Chat, {
  foreignKey: "room_id",
  as: "roomChats",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Chat.belongsTo(Room, {
  foreignKey: "room_id",
  as: "room",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Chat;
