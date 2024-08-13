
import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";
import OutgoingInvoiceProduct from "./OutgoingInvoiceProduct.entity";

const OutgoingInvoice = sequelize.define(
    'OutgoingInvoice',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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

  OutgoingInvoice.hasMany(OutgoingInvoiceProduct, { foreignKey: 'document_id', as: 'products' });
  
  export default OutgoingInvoice