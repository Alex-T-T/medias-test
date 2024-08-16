import { DataTypes } from 'sequelize';
import { sequelize } from '../../db/db.config';
import IncomingInvoiceProduct from './IncomingInvoiceProduct.entity';

const IncomingInvoice = sequelize.define(
    'IncomingInvoice',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'IncomingInvoices',
    }
);

IncomingInvoice.hasMany(IncomingInvoiceProduct, {
    foreignKey: 'document_id',
    as: 'products',
});

export default IncomingInvoice;
