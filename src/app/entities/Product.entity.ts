import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";

const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrementIdentity: true, 
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'Products',
    },
  );


  
  export default Product