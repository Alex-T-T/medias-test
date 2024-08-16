
import { DataTypes } from "sequelize";
import { sequelize } from "../../db/db.config";

const OutgoingInvoiceProduct = sequelize.define(
    'OutgoingInvoiceProduct',
    {
      document_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'OutgoingInvoices',
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
        type: DataTypes.FLOAT(11, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'OutgoingInvoiceProducts',
    },
  );


  
  export default OutgoingInvoiceProduct