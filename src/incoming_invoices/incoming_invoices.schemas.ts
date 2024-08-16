import Joi from 'joi';

export const createIncomingInvoiceSchema = Joi.object<incomingInvoiceCreate>({
    date: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD')
    .custom((value, helpers) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return helpers.error('date.invalid');
        }
        return value;
    }, 'Date validation')
    .messages({
        'string.pattern.name': '"date" must be in the format YYYY-MM-DD',
        'date.invalid': '"date" must be a valid date',
    }),
    products: Joi.array().items( Joi.object({
        product_id: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
    })).required()
});

export type incomingInvoiceCreate = {
date: Date,
products: {
    product_id: string,
    price: number,
    quantity: number,
}[]
}

export type incomingInvoice = {
    id: string,
    date: Date,
    products: {
        product_id: string,
        price: number,
        quantity: number,
    }[]
    }