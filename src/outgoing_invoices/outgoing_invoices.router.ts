import express from 'express';
import controllerWrapper from '../app/utils/controller-wrapper';
import validator from '../app/middlewares/validation.middleware';
import * as outgoingInvoiceController from './outgoing_invoices.controller';
import { createOutgoingInvoiceSchema } from './outgoing_invoices.schemas';

const router = express.Router();

router.get('/', controllerWrapper(outgoingInvoiceController.getAllInvoices));

router.post(
    '/',
    validator.body(createOutgoingInvoiceSchema),
    controllerWrapper(outgoingInvoiceController.createNewInvoice)
);

export default router;
