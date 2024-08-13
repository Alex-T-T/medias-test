import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";

const CostPrice = sequelize.define('CostPrice', {
    id: {
      type: DataTypes.STRING,
      references: {
        model: 'Products',
        key: 'id',
      },
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
  
  export default CostPrice