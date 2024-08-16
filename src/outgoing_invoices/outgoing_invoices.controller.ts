import { Request, Response } from 'express';
import OutgoingInvoice from '../app/entities/OutgoingInvoice.entity';
import * as outgoingInvoiceService from './outgoing_invoices.service';
import { HttpStatuses } from '../app/enums/http-statuses.enum';
import { calculateCostPrices } from '../cost_price/cost_price.service';

export const getAllInvoices = async (req: Request, res: Response) => {
    const products: InstanceType<typeof OutgoingInvoice>[] =
        await outgoingInvoiceService.getAllInvoices();

    res.status(HttpStatuses.OK).json(products);
};

export const createNewInvoice = async (req: Request, res: Response) => {
    const newInvoice = await outgoingInvoiceService.createNewInvoice(req.body);

    res.status(HttpStatuses.CREATED).json(newInvoice);

    await calculateCostPrices(newInvoice);
};
