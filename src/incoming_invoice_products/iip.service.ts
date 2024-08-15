import { Op } from "sequelize";
import IncomingInvoiceProduct from "../app/entities/IncomingInvoiceProduct.entity";
import { sequelize } from "../db/db.config";

export const getRemainingIncomeQuantity = async (id: string, date: Date) => {
    
    return await IncomingInvoiceProduct.sum('quantity', {
    where: {
        product_id: id,
        date: {
            [Op.lte]: date,
        },
    },
})
}


export const getCurrentMonthIncomingQuantity = async (id: string, date: Date) => { 
    return await IncomingInvoiceProduct.sum('quantity', {
    where: {
      product_id: id,
      date: {
        [Op.gte]: date,
      },
    },
  })}

  export const getCurrentMonthIncomingCost = async (id: string, date: Date) => {
    return  await IncomingInvoiceProduct.findOne({
    attributes: [
      [sequelize.fn("SUM", sequelize.literal("price * quantity")), "totalCost"]
    ],
    where: {
      product_id: id,
      date: {
        [Op.gte]: date,
      },
    },
    raw: true,
  })
}