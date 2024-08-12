import { Request, Response } from "express";
import Product from "../app/entities/Product.entity";
import * as productsService from './products.service'

export const getAllProducts = async (req: Request, res: Response) => {
    const products: InstanceType<typeof Product>[] = await productsService.getAllProducts()

    res.status(200).json(products)
}