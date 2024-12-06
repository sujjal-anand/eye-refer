import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Patients from "./Patients";
import { string } from "joi";
import Addresses from "./adresses";
import Staff from "./staff";

class doctors extends Model {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public doctortype!: string;
  public password!: string;
  public status!: Boolean;
  public gender!: string;
  public phoneno!: string;
  public profilephoto!: string;
  public tempotp!:string
}

doctors.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
    },
    doctortype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "false",
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "null",
    },
    phoneno: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "null",
    },
    profilephoto: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "null",
    },
    tempotp:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "null",
    }
  },
  {
    sequelize,
    tableName: "Doctors",
    timestamps: true,
  }
);
doctors.hasMany(Patients, { foreignKey: "referredby" });
Patients.belongsTo(doctors, { foreignKey: "referredby" });

doctors.hasMany(Patients, { foreignKey: "referredto" });
Patients.belongsTo(doctors, { foreignKey: "referredto" });

doctors.hasMany(Addresses, { foreignKey: "doctorid" });
Addresses.belongsTo(doctors, { foreignKey: "doctorid" });

doctors.hasMany(Staff, { foreignKey: "doctorid" });
Staff.belongsTo(doctors, { foreignKey: "doctorid" });

export default doctors;
