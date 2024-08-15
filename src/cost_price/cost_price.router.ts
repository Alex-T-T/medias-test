import express from 'express'
import controllerWrapper from '../app/utils/controller-wrapper';
import validator from '../app/middlewares/validation.middleware';
import { idParamSchema, queryParamSchema } from './cost_price.schema';
import * as costPriceController from './cost_price.controller'

const router = express.Router();

router.get('/:id', validator.params(idParamSchema), validator.query(queryParamSchema), controllerWrapper(costPriceController.getCostByDate))

router.get('/', controllerWrapper(costPriceController.getAllCosts))




export default router