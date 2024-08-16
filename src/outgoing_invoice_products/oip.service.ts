import { Op } from "sequelize";
import OutgoingInvoiceProduct from "../app/entities/OutgoingInvoiceProduct.entity";

export const getRemainingOutQuantity = async (id: string, monthStart: Date, monthEnd: Date) => { 
    return await OutgoingInvoiceProduct.sum('quantity', {
    where: {
        product_id: id,
        date: {
            [Op.between]: [monthStart, monthEnd],
        },
    },
})
}