import { Op } from "sequelize";
import IncomingInvoiceProduct from "../app/entities/IncomingInvoiceProduct.entity";
import { sequelize } from "../db/db.config";

export const getRemainingIncomeQuantity = async (id: string, monthStart: Date, monthEnd: Date) => {
  const quantity =  await IncomingInvoiceProduct.sum('quantity', {
    where: {
        product_id: id,
        date: {
          [Op.between]: [monthStart, monthEnd],
        },
    },
})

return quantity
}

export const getCurrentMonthIncomingQuantity = async (id: string, monthStart: Date, monthEnd: Date) => { 
    const quantity =  await IncomingInvoiceProduct.sum('quantity', {
      where: {
        product_id: id,
        date: {
          [Op.between]: [monthStart, monthEnd],
        },
      },
    })

return quantity
}

  export const getCurrentMonthIncomingCost = async (id: string, monthStart: Date, monthEnd: Date) => {
  
    const currentMonthIncomingCost = await IncomingInvoiceProduct.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.literal("price * quantity")), "totalCost"]
      ],
      where: {
        product_id: id,
        date: {
            [Op.between]: [monthStart, monthEnd],
        },
      },
      raw: true,
    }) as unknown as {totalCost: number | null}
const totalCost = currentMonthIncomingCost.totalCost || 0

  return totalCost
}