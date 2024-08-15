import { Op } from "sequelize";
import OutgoingInvoiceProduct from "../app/entities/OutgoingInvoiceProduct.entity";

export const getRemainingOutQuantity = async (id: string, date: Date) => { 
    return await OutgoingInvoiceProduct.sum('quantity', {
    where: {
        product_id: id,
        date: {
            [Op.lte]: date,
        },
    },
})
}