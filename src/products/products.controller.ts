import { Request, Response } from "express";
import Product from "../app/entities/Product.entity";
import * as productsService from './products.service'
import { HttpStatuses } from "../app/enums/http-statuses.enum";

export const getAllProducts = async (req: Request, res: Response) => {
    const products: InstanceType<typeof Product>[] = await productsService.getAllProducts()

    res.status(HttpStatuses.OK).json(products)
}

export const createNewProduct = async (req: Request, res: Response) => {


    const newProduct: InstanceType<typeof Product> = await productsService.createNewProduct(req.body)


    res.status(HttpStatuses.CREATED).json(newProduct)
}

