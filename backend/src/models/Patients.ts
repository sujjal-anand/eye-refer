import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/database";

class Patients extends Model {
  public id!: number;
  public dob!: Date;
  public email!: string;
  public phone_no!: string;
  public firstname!: string;
  public lastname!: string;
  public gender!: "Male" | "Female" | "Other";
  public disease_name!: string;
  public laterality!: "Left" | "Right" | "Both";
  public return_to_care!: string;
  public timing!: string;
  public md_name!: string;
  public location!: string;
  public insurance_company_name!: string;
  public insurance_plan!: string;
  public documentation!: string;
  public notes!: string;
}

Patients.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_no: {
      type: DataTypes.STRING,
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
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    disease_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    laterality: {
      type: DataTypes.ENUM("Left", "Right", "Both"),
      allowNull: false,
    },
    return_to_care: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timing: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    md_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insurance_company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insurance_plan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referredby: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referredto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referredtoname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    consulatationdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null, // Default to null
    },
    surgerydate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    appointmentdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    appointmenttype: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    appointmentstatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "false",
    },
    createdat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "patients",
    timestamps: false,
  }
);

export default Patients;
