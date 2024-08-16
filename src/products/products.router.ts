import express from 'express';
import controllerWrapper from '../app/utils/controller-wrapper';
import validator from '../app/middlewares/validation.middleware';
import * as productsController from './products.controller';
import { productCreateSchema } from './product.schemas';

const router = express.Router();

router.get('/', controllerWrapper(productsController.getAllProducts));

router.post(
    '/',
    validator.body(productCreateSchema),
    controllerWrapper(productsController.createNewProduct)
);

export default router;
