
import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";

const OutgoingInvoiceProduct = sequelize.define(
    'OutgoingInvoiceProduct',
    {
      document_id: {
        type: DataTypes.INTEGER,
        autoIncrementIdentity: true, 
        references: {
          model: 'OutgoingInvoices',
          key: 'id',
        },
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
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
      tableName: 'OutgoingInvoiceProducts',
    },
  );


  
  export default OutgoingInvoiceProduct