
import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";

const IncomingInvoice = sequelize.define(
    'IncomingInvoice',
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
      tableName: 'IncomingInvoices',
    },
  );


  
  export default IncomingInvoice