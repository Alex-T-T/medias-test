import express from 'express'
import controllerWrapper from '../app/utils/controller-wrapper';
import validator from '../app/middlewares/validation.middleware';
import * as incoming_invoices from './incoming_invoices.controller'
import { createIncomingInvoiceSchema } from './incoming_invoices.schemas';

const router = express.Router();

router.get('/', controllerWrapper(incoming_invoices.getAllInvoices));

router.post(
    '/',
    validator.body(createIncomingInvoiceSchema),
    controllerWrapper(incoming_invoices.createNewInvoice)
);


export default router;