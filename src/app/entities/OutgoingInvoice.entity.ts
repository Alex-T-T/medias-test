
import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";

const OutgoingInvoice = sequelize.define(
    'OutgoingInvoice',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrementIdentity: true, 
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'OutgoingInvoices',
    },
  );


  
  export default OutgoingInvoice