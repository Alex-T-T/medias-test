import { Request, Response } from "express";
import IncomingInvoice from "../app/entities/IncomingInvoice.entity";
import * as incomingInvoiceService from './incoming_invoices.service'
import { HttpStatuses } from "../app/enums/http-statuses.enum";
import { recalculateCostPrices } from "../cost_price/cost_price.service";
import { incomingInvoice } from "./incoming_invoices.schemas";

export const getAllInvoices = async (req: Request, res: Response) => {
   
    const products: InstanceType<typeof IncomingInvoice>[] = await incomingInvoiceService.getAllInvoices()

    res.status(HttpStatuses.OK).json(products)
}

export const createNewInvoice = async (req: Request, res: Response) => {

    const newInvoice = await incomingInvoiceService.createNewInvoice(req.body) as unknown as incomingInvoice

    res.status(HttpStatuses.CREATED).json(newInvoice)

    await recalculateCostPrices(newInvoice)

}

