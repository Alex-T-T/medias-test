
import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";

const IncomingInvoiceProduct = sequelize.define(
    'IncomingInvoiceProduct',
    {
      document_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'IncomingInvoices',
          key: 'id',
        },
        allowNull: false,
      },
      product_id: {
        type: DataTypes.STRING,
        references: {
          model: 'Products', 
          key: 'id',
        },
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: 'IncomingInvoiceProducts',
    },
  );


  
  export default IncomingInvoiceProduct