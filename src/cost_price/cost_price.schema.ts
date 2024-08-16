import Joi from 'joi';

export const idParamSchema = Joi.object<{ id: string }>({
    id: Joi.string().required(),
});

export const queryParamSchema = Joi.object<{ date: Date }>({
    date: Joi.string()
        .optional()
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
});

export type cost_price = {
    id: string;
    date: Date;
    value: number;
};
