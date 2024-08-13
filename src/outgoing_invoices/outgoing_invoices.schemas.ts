import Joi from 'joi';

export const createIncomingInvoiceSchema = Joi.object<outgoingInvoiceCreate>({
    date: Joi.date().required(),
    products: Joi.array().items( Joi.object({
        product_id: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
    })).required()
});

export type outgoingInvoiceCreate = {
date: Date,
 products: {
    product_id: string,
    price: number,
    quantity: number,
}[]
}

export type outgoingInvoice = {
    id: string,
    date: Date,
    products: {
        product_id: string,
        price: number,
        quantity: number,
    }[]
    }