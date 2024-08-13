
import { incomingInvoice } from "../incoming_invoices/incoming_invoices.schemas";
import { outgoingInvoice } from "../outgoing_invoices/outgoing_invoices.schemas";
import * as incomingInvoiceService from '../incoming_invoices/incoming_invoices.service'
import * as outgoingInvoiceService from '../outgoing_invoices/outgoing_invoices.service'
import OutgoingInvoiceProduct from "../app/entities/OutgoingInvoiceProduct.entity";
import IncomingInvoiceProduct from "../app/entities/IncomingInvoiceProduct.entity";
import CostPrice from "../app/entities/CostPrice.entity";
import { Op } from "sequelize";
import { sequelize } from "../db/db.config";




export const recalculateCostPrices = async (invoice: incomingInvoice | outgoingInvoice) => {
const {date, products} = invoice

const currentMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);
const previousMonthEnd = new Date(currentMonthStart);
previousMonthEnd.setDate(0);

products.forEach( async (product) => {

    // 1. Залишок на початок поточного місяця (на кінець попереднього місяця)
const lastMonthCostPrice = await CostPrice.findOne({
    where: {
      id: product.product_id,
      date: {
        [Op.lte]: previousMonthEnd,
      },
    },
    order: [['date', 'DESC']],
  });
  
  const lastMonthStock = lastMonthCostPrice
    ? await OutgoingInvoiceProduct.sum('quantity', {
        where: {
          product_id: product.product_id,
          createdAt: {
            [Op.lte]: previousMonthEnd,
          },
        },
      })
    : 0;
  
  // 2. Весь прихід товару A за поточний місяць (к-ть штук)
  const currentMonthIncomingQuantity = await IncomingInvoiceProduct.sum('quantity', {
    where: {
      product_id: product.product_id,
      createdAt: {
        [Op.gte]: currentMonthStart,
      },
    },
  });
  
  // 3. Загальний залишок товару A на поточний момент
  const currentStock = lastMonthStock + currentMonthIncomingQuantity;
  
  console.log(`Загальний залишок товару ${product.product_id} на поточний момент:`, currentStock);
  

  // 4. Загальна вартість товару, який поступив за цей місяць
  const currentMonthIncomingPrice = await IncomingInvoiceProduct.sum('price', {
    where: {
      product_id: product.product_id,
      createdAt: {
        [Op.gte]: currentMonthStart,
      },
    },
  });
  
  console.log(`Загальна вартість товару ${product.product_id}, який поступив за цей місяць (грн):`, currentMonthIncomingPrice);

// 5. Загальна к-ть товару, який поступив за цей місяць

const remainingQuantity = await IncomingInvoiceProduct.sum('quantity', {
    where: {
      product_id: product.product_id,
      createdAt: {
        [Op.lte]: previousMonthEnd,
      },
    },
  });


})
};