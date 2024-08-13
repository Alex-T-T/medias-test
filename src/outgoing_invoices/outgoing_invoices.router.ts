import express from 'express'
import controllerWrapper from '../app/utils/controller-wrapper';
import validator from '../app/middlewares/validation.middleware';
import * as outgoingInvoiceController from './outgoing_invoices.controller'
import { createIncomingInvoiceSchema } from './outgoing_invoices.schemas';

const router = express.Router();

router.get('/', controllerWrapper(outgoingInvoiceController.getAllInvoices));

router.post(
    '/',
    validator.body(createIncomingInvoiceSchema),
    controllerWrapper(outgoingInvoiceController.createNewInvoice)
);



export default router;