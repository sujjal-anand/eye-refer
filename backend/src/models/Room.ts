import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import doctors from "./Doctors";
import Patients from "./Patients";

class Room extends Model {
  public id!: number;
  public name!: string;
  public user_id_1!: number;
  public user_id_2!: number;
  public patient_id!: number;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "Room",
    sequelize,
  }
);

doctors.hasMany(Room, {
  foreignKey: "user_id_1",
  as: "doc1",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Room.belongsTo(doctors, {
  foreignKey: "user_id_1",
  as: "doc1",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

doctors.hasMany(Room, {
  foreignKey: "user_id_2",
  as: "doc2",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Room.belongsTo(doctors, {
  foreignKey: "user_id_2",
  as: "doc2",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Patients.hasMany(Room, {
  foreignKey: "patient_id",
  as: "patient",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Room.belongsTo(Patients, {
  foreignKey: "patient_id",
  as: "patient",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Room;
