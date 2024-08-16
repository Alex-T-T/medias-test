
import { incomingInvoice } from "../incoming_invoices/incoming_invoices.schemas";
import { outgoingInvoice } from "../outgoing_invoices/outgoing_invoices.schemas";
import CostPrice from "../app/entities/CostPrice.entity";
import { cost_price } from "./cost_price.schema";
import * as incomingInvoiceProductsService from "../incoming_invoice_products/iip.service";
import * as outgoingInvoiceProductsService from '../outgoing_invoice_products/oip.service'
import { Op } from "sequelize";

export const calculateCostPrices = async (invoice: incomingInvoice | outgoingInvoice) => {
    const { date, products } = invoice;
    const currentDate = new Date();
    const invoiceMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);

    // Calculate the number of months between the invoice date and the current date
    const monthsDifference = (currentDate.getFullYear() - date.getFullYear()) * 12 + (currentDate.getMonth() - date.getMonth());

    const productPromises: any[] = [];

    if (monthsDifference > 0) {
        console.log('monthsDifference: ', monthsDifference);
        // Loop through each month from the invoice date to the current date
        for (let i = 0; i <= monthsDifference; i++) {
            console.log('i: ', i);
            const targetMonthStart = new Date(invoiceMonthStart);
            targetMonthStart.setMonth(targetMonthStart.getMonth() + i);
            
            products.forEach(async product => {
         await calculateMonthlyCostPrice(product.product_id, targetMonthStart)

            });
        }
    } else {
        products.forEach(async product => {
         await calculateMonthlyCostPrice(product.product_id, invoiceMonthStart)
        });
    }
};

export const calculateMonthlyCostPrice = async (id: string, invoiceMonthStart: Date ) => {
    console.log('invoiceMonthStart:', invoiceMonthStart);

const invoiceMonthEnd = new Date(invoiceMonthStart);
invoiceMonthEnd.setMonth(invoiceMonthEnd.getMonth() + 1)
invoiceMonthEnd.setDate(0)

    const previousMonthEnd = new Date(invoiceMonthStart);
    previousMonthEnd.setDate(0);

    const invoicePreviousMonthStart = new Date(invoiceMonthStart);
    invoicePreviousMonthStart.setMonth(invoicePreviousMonthStart.getMonth() - 1);

    // 1. Загальна вартість залишку товару
    const lastMonthCostPrice = await getLastMonthCostPrice(id, previousMonthEnd) as unknown as cost_price;
    console.log(`собівартість товару ${id} за попередній місяць:`, lastMonthCostPrice?.value);

    const remainingIncomeQuantity = await incomingInvoiceProductsService.getRemainingIncomeQuantity(id, invoicePreviousMonthStart, previousMonthEnd) || 0;
    console.log('remainingIncomeQuantity: ', remainingIncomeQuantity);
    const remainingOutQuantity = await outgoingInvoiceProductsService.getRemainingOutQuantity(id, invoicePreviousMonthStart, previousMonthEnd) || 0;
    console.log('remainingOutQuantity: ', remainingOutQuantity);
    const totalQuantityOnPreviousMonth = remainingIncomeQuantity - remainingOutQuantity;
    console.log('totalQuantityOnPreviousMonth:', totalQuantityOnPreviousMonth);

    const totalCostForPreviousMonth = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(id, invoicePreviousMonthStart, previousMonthEnd) as number;
    console.log('totalCostForPreviousMonth:', totalCostForPreviousMonth);

    const totalProductCost = (lastMonthCostPrice && lastMonthCostPrice.value) ? (lastMonthCostPrice.value * totalQuantityOnPreviousMonth) : (totalQuantityOnPreviousMonth * totalCostForPreviousMonth);
    console.log('totalProductCost:', totalProductCost);

    // 2. Весь прихід товару за поточний місяць
    const currentMonthIncomingQuantity = await incomingInvoiceProductsService.getCurrentMonthIncomingQuantity(id, invoiceMonthStart, invoiceMonthEnd) || 0;
    console.log('currentMonthIncomingQuantity:', currentMonthIncomingQuantity);

    // 3. Загальний залишок товару на поточний момент
    const currentStock = totalQuantityOnPreviousMonth + currentMonthIncomingQuantity;
    console.log('currentStock:', currentStock);

    // 4. Загальна вартість товару, який поступив за цей місяць
    const currentMonthIncomingCost = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(id, invoiceMonthStart, invoiceMonthEnd) || 0;
    console.log('currentMonthIncomingCost:', currentMonthIncomingCost);

    // 5. Поточна собівартість товару
    const currentCostPrice = (totalProductCost + currentMonthIncomingCost) / currentStock;
    console.log('totalProductCost: ', totalProductCost);
    console.log('currentMonthIncomingCost: ', currentMonthIncomingCost);
    console.log('currentStock: ', currentStock);
    console.log('currentCostPrice:', currentCostPrice);

    const existingCurrentCostPrice = await CostPrice.findOne({
        where: {
            id,
            date: invoiceMonthStart,
        },
    });

    if (existingCurrentCostPrice) {
        console.log('currentCostPrice before set:', currentCostPrice);
        existingCurrentCostPrice.set('value', currentCostPrice);
        console.log('currentCostPrice after set:', existingCurrentCostPrice.getDataValue("value"));
        await existingCurrentCostPrice.save();
        console.log('currentCostPrice after save:', existingCurrentCostPrice.getDataValue("value"));

    } else {
        await CostPrice.create({
            id,
            date: invoiceMonthStart,
            value: currentCostPrice,
        });
    }
};


// export const calculateCostPrices = async (invoice: incomingInvoice | outgoingInvoice) => {
//     const { date, products } = invoice;

//     const currentDate = new Date();
//     const invoiceMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);

//     // Calculate the number of months between the invoice date and the current date
//     const monthsDifference = (currentDate.getFullYear() - date.getFullYear()) * 12 + (currentDate.getMonth() - date.getMonth());

//     if(monthsDifference > 0) {
//      // Loop through each month from the invoice date to the current date
//         for (let i = 0; i <= monthsDifference; i++) {
//             const targetMonthStart = new Date(invoiceMonthStart);
//             targetMonthStart.setMonth(targetMonthStart.getMonth() + i);
            
//             products.map(async(product) => {
//                 return await calculateMonthlyCostPrice(product.product_id, targetMonthStart);
//             })
//         }
//     } else {
//         products.map(async(product) => {
//             return await calculateMonthlyCostPrice(product.product_id, invoiceMonthStart);
//         })
//     }
// };

// export const calculateMonthlyCostPrice = async (id: string, invoiceMonthStart: Date ) => {
//     console.log('invoiceMonthStart: ', invoiceMonthStart);

//     const previousMonthEnd = new Date(invoiceMonthStart);
//     previousMonthEnd.setDate(0);
    
//     const invoicePreviousMonthStart = new Date(invoiceMonthStart);
//     console.log('invoicePreviousMonthStart: before set  ', invoicePreviousMonthStart);
//     invoicePreviousMonthStart.setMonth(invoicePreviousMonthStart.getMonth() - 1);
//     console.log('invoicePreviousMonthStart after set: ', invoicePreviousMonthStart);


//     // 1. Загальна вартість залишку товару - собівартість товару за попередній місяць * залишок товару на кінець попереднього місяця. 
//     // 1.1   собівартість товару за попередній місяць
    
//     const lastMonthCostPrice = await getLastMonthCostPrice(id, previousMonthEnd) as unknown as cost_price
    
//     console.log(`собівартість товару ${id} за попередній місяць: `, lastMonthCostPrice);
    
//     // 1.2  залишок товару на кінець попереднього місяця.
    
//     const remainingIncomeQuantity = await incomingInvoiceProductsService.getRemainingIncomeQuantity(id, previousMonthEnd) || 0
    
//     const remainingOutQuantity = await outgoingInvoiceProductsService.getRemainingOutQuantity(id, previousMonthEnd) || 0
    
//     const totalQuantityOnPreviousMonth = remainingIncomeQuantity - remainingOutQuantity
//     console.log('totalQuantityOnPreviousMonth: ', totalQuantityOnPreviousMonth);
    
//     const totalCostForPreviousMonth = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(id, invoicePreviousMonthStart) as number
//     console.log('totalCostForPreviousMonth: ', totalCostForPreviousMonth);

//     // result 1 
//     const totalProductCost = (lastMonthCostPrice && lastMonthCostPrice.value) ? (lastMonthCostPrice.value * totalQuantityOnPreviousMonth ) : (totalQuantityOnPreviousMonth * totalCostForPreviousMonth)
//     console.log('totalProductCost: ', totalProductCost);
    
//     // 2. Весь прихід товару за поточний місяць (к-ть штук)
//     const currentMonthIncomingQuantity = await incomingInvoiceProductsService.getCurrentMonthIncomingQuantity(id, invoiceMonthStart) || 0
//     console.log('currentMonthIncomingQuantity: ', currentMonthIncomingQuantity);
    
//       // 3. Загальний залишок товару на поточний момент
//     const currentStock = totalQuantityOnPreviousMonth + currentMonthIncomingQuantity;
//     console.log('currentStock: ', currentStock);
        
//       // 4. Загальна вартість товару, який поступив за цей місяць
//     const currentMonthIncomingCost = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(id, invoiceMonthStart) || 0
//     console.log('currentMonthIncomingCost: ', currentMonthIncomingCost);
    
//     // 5. Поточна собівартість товару
//     const currentCostPrice = (totalProductCost + currentMonthIncomingCost || 0)/ currentStock
//     console.log('currentStock: ', currentStock);
    
//     const existingCurrentCostPrice = await CostPrice.findOne({
//         where: {
//             id,
//             date: invoiceMonthStart,
//         },
//     });
    
//     if (existingCurrentCostPrice) {
//         console.log('currentCostPrice before set:', currentCostPrice);
//         existingCurrentCostPrice.set('value', currentCostPrice);
//         console.log('currentCostPrice after set:', existingCurrentCostPrice.getDataValue("value"))
//         const updatedCostPrice = await existingCurrentCostPrice.save();
//         console.log('updatedCostPrice: ', updatedCostPrice.getDataValue("value"));
//     } else {
//         await CostPrice.create({
//             id,
//             date: invoiceMonthStart,
//             value: currentCostPrice,
//         });
//     }
//     };


export const getCostPriceByDate = async (id: string, date: Date) => {
    const parsedDate = new Date(date);
    const currentMonthStart = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);

    const costPrice = await CostPrice.findOne({where: {
        id,
        date: currentMonthStart
    }})

    return costPrice
}

export const getLastMonthCostPrice = async (id: string, date: Date) => {
   const lastMonthCostPrice = await CostPrice.findOne({
    where: {
        id,
        date: {
            [Op.lte]: date,
        },
    },
    order: [['date', 'DESC']],
}) 
return lastMonthCostPrice
}

export const getAllCosts = async () => {

    return await CostPrice.findAll({order: [['date', "DESC"]]}) 
}