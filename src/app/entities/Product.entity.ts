import { DataTypes } from 'sequelize';
import { sequelize } from '../../db/db.config';
import IncomingInvoiceProduct from './IncomingInvoiceProduct.entity';
import OutgoingInvoiceProduct from './OutgoingInvoiceProduct.entity';
import CostPrice from './CostPrice.entity';

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'Products',
    }
);

Product.hasMany(IncomingInvoiceProduct, { foreignKey: 'product_id' });
Product.hasMany(OutgoingInvoiceProduct, { foreignKey: 'product_id' });
Product.hasOne(CostPrice, { foreignKey: 'id' });

export default Product;
