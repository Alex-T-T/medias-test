import { Request, Response } from "express";
import * as costPriceService from './cost_price.service'
import { HttpStatuses } from "../app/enums/http-statuses.enum";

export const getCostByDate = async (req: Request, res: Response) => {
    const {id} = req.params
    const date = req.query.date as unknown as Date

    const costPrice = await costPriceService.getCostPriceByDate(id, date)

   if (!costPrice) {
    res.status(HttpStatuses.OK).json({message: ' Cost price for this product is not provided yet.'})
   }

   res.status(HttpStatuses.OK).json(costPrice)
}

export const getAllCosts= async (req: Request, res: Response) => {

    const costPrices = await costPriceService.getAllCosts()

   res.status(HttpStatuses.OK).json(costPrices)

}