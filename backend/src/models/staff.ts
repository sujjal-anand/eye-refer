import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/database";

class Staff extends Model {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public gender!: "male" | "female" | "other";
  public phoneno!: string;
  public doctorid!: number;
}

Staff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },
    phoneno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctorid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "staff",
    timestamps: true,
  }
);

export default Staff;
