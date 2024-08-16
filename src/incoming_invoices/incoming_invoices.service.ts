import { incomingInvoiceCreate } from './incoming_invoices.schemas';
import IncomingInvoice from '../app/entities/IncomingInvoice.entity';
import IncomingInvoiceProduct from '../app/entities/IncomingInvoiceProduct.entity';
import { sequelize } from '../db/db.config';

export const getAllInvoices = async () => {
    const invoices = await IncomingInvoice.findAll({
        include: [
            {
                model: IncomingInvoiceProduct,
                as: 'products',
            },
        ],
    });

    return invoices;
};

export const getInvoiceById = async (id: string) => {
    const invoice = await IncomingInvoice.findOne({
        where: { id },
        include: [
            {
                model: IncomingInvoiceProduct,
                as: 'products',
            },
        ],
    });

    return invoice;
};

export const createNewInvoice = async (createDTO: incomingInvoiceCreate) => {
    const transaction = await sequelize.transaction();
    try {
        const newInvoice = (await IncomingInvoice.create(
            {
                date: createDTO.date,
            },
            { transaction }
        )) as unknown as typeof IncomingInvoice & { id: string };

        const productPromises = createDTO.products.map((product) => {
            return IncomingInvoiceProduct.create(
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

        const invoiceWithRelations = await getInvoiceById(newInvoice.id);

        return invoiceWithRelations;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
