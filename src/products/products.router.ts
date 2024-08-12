import express from 'express'
import controllerWrapper from '../app/utils/controller-wrapper';
import validator from '../app/middlewares/validation.middleware';
import * as productsController from './producrts.controller'

const router = express.Router();

router.get('/', controllerWrapper(productsController.getAllProducts));

// router.post(
//     '/',
//     validator.body(companyCreateSchema),
//     controllerWrapper(companiesController.createNewCompany)
// );

// router.patch(
//     '/:name',
//     validator.params(nameParamsSchema),
//     validator.body(companyUpdateSchema),
//     controllerWrapper(companiesController.updateCompanyByName)
// );

// router.delete(
//     '/:name',
//     validator.params(nameParamsSchema),
//     controllerWrapper(companiesController.deleteCompanyByName)
// );

export default router;