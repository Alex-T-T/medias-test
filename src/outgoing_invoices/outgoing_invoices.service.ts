import {
    outgoingInvoice,
    outgoingInvoiceCreate,
} from './outgoing_invoices.schemas';
import OutgoingInvoice from '../app/entities/OutgoingInvoice.entity';
import { sequelize } from '../db/db.config';
import OutgoingInvoiceProduct from '../app/entities/OutgoingInvoiceProduct.entity';

export const getAllInvoices = async () => {
    const invoices = await OutgoingInvoice.findAll({
        include: [
            {
                model: OutgoingInvoiceProduct,
                as: 'products',
            },
        ],
    });

    return invoices;
};

export const getInvoiceById = async (id: string) => {
    const invoice = await OutgoingInvoice.findOne({
        where: { id },
        include: [
            {
                model: OutgoingInvoiceProduct,
                as: 'products',
            },
        ],
    });

    return invoice;
};

export const createNewInvoice = async (createDTO: outgoingInvoiceCreate) => {
    const transaction = await sequelize.transaction();
    try {
        const newInvoice = (await OutgoingInvoice.create(
            {
                date: createDTO.date,
            },
            { transaction }
        )) as unknown as typeof OutgoingInvoice & { id: string };

        const productPromises = createDTO.products.map((product) => {
            return OutgoingInvoiceProduct.create(
                {
                    document_id: newInvoice.id,
                    product_id: product.product_id,
                    price: product.price,
                    quantity: product.quantity,
                    date: createDTO.date,
                },
                { transaction }
            );
        });

        await Promise.all(productPromises);

        await transaction.commit();

        const invoiceWithRelations = (await getInvoiceById(
            newInvoice.id
        )) as unknown as outgoingInvoice;

        return invoiceWithRelations;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
