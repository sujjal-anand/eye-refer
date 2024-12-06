import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
// import pr

class temp_doctors
 extends Model {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public doctortype!:string;
  public password!: string;
  public otp!:string ;
}

temp_doctors.init(
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
    doctortype:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp:{
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    tableName: "temp_doctors",
    timestamps: true,
  }
);
// retailers.hasMany(products, { foreignKey: "retailerid" });
// products.belongsTo(retailers, { foreignKey: "retailerid" });

export default temp_doctors;
