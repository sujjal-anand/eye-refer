import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Addresses extends Model {
  public id!: number;
  public addresstitle!: string;
  public officenumber!: string;
  public faxno!: string;
  public street!: string;
  public city!: string;
  public state!: string;
  public country!: string;
  public zip!: string;
  public doctorid!: number; 
}

Addresses.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    addresstitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    officenumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    faxno: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctorid:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  
  {
    sequelize,
    tableName: "addresses",
    timestamps: false, 
  }
);

export default Addresses;
