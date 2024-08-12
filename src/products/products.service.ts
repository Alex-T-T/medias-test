import Product from "../app/entities/Product.entity"


export const getAllProducts = async () => {

    const products = await Product.findAll()

    return products
}