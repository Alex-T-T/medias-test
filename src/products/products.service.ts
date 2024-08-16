import { Op } from "sequelize"
import Product from "../app/entities/Product.entity"
import { HttpStatuses } from "../app/enums/http-statuses.enum"
import HttpException from "../app/exceptions/http-exception"
import { productCreate } from "./product.schemas"


export const getAllProducts = async () => {

    const products = await Product.findAll()

    return products
}

export const getProductById = async (id: string) => {

    const product = await Product.findOne({where:{ id }})

    return product
}

export const getProductByIdOrName = async (id: string, name: string ) => {

    const product = await Product.findAll({where:{ [Op.or]: [{id}, {name}]}})

    return product
}

export const createNewProduct = async (createDTO: productCreate) => {
    const {id, name} = createDTO

const existingProduct = await getProductByIdOrName(id, name )
console.log('existingProduct: ', existingProduct);

if(existingProduct.length) throw new HttpException(HttpStatuses.CONFLICT, `Product with id = '${id}' or name = '${name}' already exist`)

    const newProduct = await Product.create(createDTO)

return newProduct


}