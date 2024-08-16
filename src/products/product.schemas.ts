import Joi from 'joi';

export const productCreateSchema = Joi.object<productCreate>({
    id: Joi.string().required(),
    name: Joi.string().min(3).required()
});

export type productCreate = {
id: string,
name: string
}


export const productSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  });