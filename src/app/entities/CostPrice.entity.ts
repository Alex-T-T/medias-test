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
      primaryKey: true,

    },
    value: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false,
    },
  },
  {
    indexes: [
        {
            unique: true, 
            fields: ['id', 'date'], 
        },
    ],
}
);
  
  export default CostPrice