import Joi from 'joi';

export const idParamSchema = Joi.object<{ id: string }>({
    id: Joi.string().required(),
});

export const queryParamSchema = Joi.object<{ date: Date }>({
    date: Joi.date().required().custom((value, helpers) => {
        if (!(value instanceof Date)) {
            return helpers.error('any.invalid');
        }
        return value;
    })
});

export type cost_price = {
    id: string,
    date: Date,
    value: number
    }