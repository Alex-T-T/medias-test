
import { incomingInvoice } from "../incoming_invoices/incoming_invoices.schemas";
import { outgoingInvoice } from "../outgoing_invoices/outgoing_invoices.schemas";
import CostPrice from "../app/entities/CostPrice.entity";
import { cost_price } from "./cost_price.schema";
import * as incomingInvoiceProductsService from "../incoming_invoice_products/iip.service";
import * as outgoingInvoiceProductsService from '../outgoing_invoice_products/oip.service'
import { Op } from "sequelize";


export const calculateCostPrices = async (invoice: incomingInvoice | outgoingInvoice) => {
    const { date, products } = invoice;

    const currentDate = new Date(); // Current date to determine how far in the past the invoice is
    const invoiceMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    
    // Calculate the number of months between the invoice date and the current date
    const monthsDifference = (currentDate.getFullYear() - date.getFullYear()) * 12 + (currentDate.getMonth() - date.getMonth());

    // Loop through each month from the invoice date to the current date
    for (let i = 0; i <= monthsDifference; i++) {
        const targetMonthStart = new Date(invoiceMonthStart);
        targetMonthStart.setMonth(targetMonthStart.getMonth() + i); // Move to the target month
        
        // Calculate cost prices for the target month
  products.map(async(product) => {
      return await calculateMonthlyCostPrice(product.product_id, targetMonthStart);
  })
    }
};

export const calculateMonthlyCostPrice = async (id: string, invoiceMonthStart: Date ) => {
    // const {date, products} = invoice

    const previousMonthEnd = new Date(invoiceMonthStart);
    previousMonthEnd.setDate(0);
    
    
    // 1. Загальна вартість залишку товару - собівартість товару за попередній місяць * залишок товару на кінець попереднього місяця. 
    // 1.1   собівартість товару за попередній місяць
    
    const lastMonthCostPrice = await getLastMonthCostPrice(id, previousMonthEnd) as unknown as cost_price
    
    console.log(`собівартість товару ${id} за попередній місяць: `, lastMonthCostPrice);
    
    // 1.2  залишок товару на кінець попереднього місяця.
    
    const remainingIncomeQuantity = await incomingInvoiceProductsService.getRemainingIncomeQuantity(id, previousMonthEnd)
    
    const remainingOutQuantity = await outgoingInvoiceProductsService.getRemainingOutQuantity(id, previousMonthEnd)
    
    const totalQuantityOnPreviousMonth = remainingIncomeQuantity - remainingOutQuantity
    console.log('totalQuantityOnPreviousMonth: ', totalQuantityOnPreviousMonth);
    
    const totalProductCost = lastMonthCostPrice ? lastMonthCostPrice.value * totalQuantityOnPreviousMonth : 0
    
    // 2. Весь прихід товару за поточний місяць (к-ть штук)
    
    const currentMonthIncomingQuantity = await incomingInvoiceProductsService.getCurrentMonthIncomingQuantity(id, invoiceMonthStart)
      
      // 3. Загальний залишок товару на поточний момент
      const currentStock = totalQuantityOnPreviousMonth + currentMonthIncomingQuantity;
      
      console.log(`Загальний залишок товару ${id} на поточний момент:`, currentStock);
      
    
      // 4. Загальна вартість товару, який поступив за цей місяць
    
    const currentMonthIncomingCost = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(id, invoiceMonthStart)
      
      console.log(`Загальна вартість товару ${id}, який поступив за цей місяць (грн):`, currentMonthIncomingCost);
    
    // 5. Поточна собівартість товару
    const currentCostPrice = (totalProductCost + (currentMonthIncomingCost as any)?.totalCost || 0)/ currentStock
    console.log(`Поточна собівартість товару ${id}: `, currentCostPrice);
    
    
    const existingCurrentCostPrice = await CostPrice.findOne({
        where: {
            id,
            date: invoiceMonthStart,
        },
    });
    console.log('existingCurrentCostPrice: ', existingCurrentCostPrice);
    
    
    if (existingCurrentCostPrice) {
        // Update the existing entry
        existingCurrentCostPrice.set('value', currentCostPrice);
        await existingCurrentCostPrice.save();
        console.log('Updated existingCurrentCostPrice: ', existingCurrentCostPrice);
    } else {
        console.log('currentMonthStart: ', invoiceMonthStart);
        // Create a new entry
        const newCostPrice = await CostPrice.create({
            id,
            date: invoiceMonthStart,
            value: currentCostPrice,
        });
        console.log('Created newCostPrice: ', newCostPrice);
    }
    };


// export const calculateCostPrices = async (invoice: incomingInvoice | outgoingInvoice) => {
// const {date, products} = invoice

// const currentMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);
// const previousMonthEnd = new Date(currentMonthStart);
// previousMonthEnd.setDate(0);

// products.map( async (product) => {

// // 1. Загальна вартість залишку товару - собівартість товару за попередній місяць * залишок товару на кінець попереднього місяця. 
// // 1.1   собівартість товару за попередній місяць

// const lastMonthCostPrice = await getLastMonthCostPrice(product.product_id, previousMonthEnd) as unknown as cost_price

// console.log(`собівартість товару ${product.product_id} за попередній місяць: `, lastMonthCostPrice);

// // 1.2  залишок товару на кінець попереднього місяця.

// const remainingIncomeQuantity = await incomingInvoiceProductsService.getRemainingIncomeQuantity(product.product_id, previousMonthEnd)

// const remainingOutQuantity = await outgoingInvoiceProductsService.getRemainingOutQuantity(product.product_id, previousMonthEnd)

// const totalQuantityOnPreviousMonth = remainingIncomeQuantity - remainingOutQuantity
// console.log('totalQuantityOnPreviousMonth: ', totalQuantityOnPreviousMonth);

// const totalProductCost = lastMonthCostPrice ? lastMonthCostPrice.value * totalQuantityOnPreviousMonth : 0

// // 2. Весь прихід товару за поточний місяць (к-ть штук)

// const currentMonthIncomingQuantity = await incomingInvoiceProductsService.getCurrentMonthIncomingQuantity(product.product_id, currentMonthStart)
  
//   // 3. Загальний залишок товару на поточний момент
//   const currentStock = totalQuantityOnPreviousMonth + currentMonthIncomingQuantity;
  
//   console.log(`Загальний залишок товару ${product.product_id} на поточний момент:`, currentStock);
  

//   // 4. Загальна вартість товару, який поступив за цей місяць

// const currentMonthIncomingCost = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(product.product_id, currentMonthStart)
  
//   console.log(`Загальна вартість товару ${product.product_id}, який поступив за цей місяць (грн):`, currentMonthIncomingCost);

// // 5. Поточна собівартість товару
// const currentCostPrice = (totalProductCost + (currentMonthIncomingCost as any)?.totalCost || 0)/ currentStock
// console.log(`Поточна собівартість товару ${product.product_id}: `, currentCostPrice);


// const existingCurrentCostPrice = await CostPrice.findOne({
//     where: {
//         id: product.product_id,
//         date: currentMonthStart,
//     },
// });
// console.log('existingCurrentCostPrice: ', existingCurrentCostPrice);


// if (existingCurrentCostPrice) {
//     // Update the existing entry
//     existingCurrentCostPrice.set('value', currentCostPrice);
//     await existingCurrentCostPrice.save();
//     console.log('Updated existingCurrentCostPrice: ', existingCurrentCostPrice);
// } else {
//     console.log('currentMonthStart: ', currentMonthStart);
//     // Create a new entry
//     const newCostPrice = await CostPrice.create({
//         id: product.product_id,
//         date: currentMonthStart,
//         value: currentCostPrice,
//     });
//     console.log('Created newCostPrice: ', newCostPrice);
// }

// })
// };

export const getCostPriceByDate = async (id: string, date: Date) => {
    const currentMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);

    const costPrice = await CostPrice.findOne({where: {
        id,
        date: currentMonthStart
    }})

    return costPrice
}

export const getLastMonthCostPrice = async (id: string, date: Date) => {
    return await CostPrice.findOne({
    where: {
        id,
        date: {
            [Op.lte]: date,
        },
    },
    order: [['date', 'DESC']],
}) }

export const getAllCosts = async () => {

    return await CostPrice.findAll({order: [['date', "DESC"]]}) 
}