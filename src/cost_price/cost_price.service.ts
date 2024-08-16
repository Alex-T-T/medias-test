
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

    if (monthsDifference > 0) {

        // Loop through each month from the invoice date to the current date
        for (let i = 0; i <= monthsDifference; i++) {
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

const invoiceMonthEnd = new Date(invoiceMonthStart);
invoiceMonthEnd.setMonth(invoiceMonthEnd.getMonth() + 1)
invoiceMonthEnd.setDate(0)

    const previousMonthEnd = new Date(invoiceMonthStart);
    previousMonthEnd.setDate(0);

    const invoicePreviousMonthStart = new Date(invoiceMonthStart);
    invoicePreviousMonthStart.setMonth(invoicePreviousMonthStart.getMonth() - 1);

    // 1. Загальна вартість залишку товару
    const lastMonthCostPrice = await getLastMonthCostPrice(id, previousMonthEnd) as unknown as cost_price;

    const remainingIncomeQuantity = await incomingInvoiceProductsService.getRemainingIncomeQuantity(id, invoicePreviousMonthStart, previousMonthEnd) || 0;

    const remainingOutQuantity = await outgoingInvoiceProductsService.getRemainingOutQuantity(id, invoicePreviousMonthStart, previousMonthEnd) || 0;

    const totalQuantityOnPreviousMonth = remainingIncomeQuantity - remainingOutQuantity;

    const totalCostForPreviousMonth = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(id, invoicePreviousMonthStart, previousMonthEnd) as number;

    const totalProductCost = (lastMonthCostPrice && lastMonthCostPrice.value) ? (lastMonthCostPrice.value * totalQuantityOnPreviousMonth) : (totalQuantityOnPreviousMonth * totalCostForPreviousMonth);

    // 2. Весь прихід товару за поточний місяць
    const currentMonthIncomingQuantity = await incomingInvoiceProductsService.getCurrentMonthIncomingQuantity(id, invoiceMonthStart, invoiceMonthEnd) || 0;

    // 3. Загальний залишок товару на поточний момент
    const currentStock = totalQuantityOnPreviousMonth + currentMonthIncomingQuantity;

    // 4. Загальна вартість товару, який поступив за цей місяць
    const currentMonthIncomingCost = await incomingInvoiceProductsService.getCurrentMonthIncomingCost(id, invoiceMonthStart, invoiceMonthEnd) || 0;

    // 5. Поточна собівартість товару
    const currentCostPrice = (totalProductCost + currentMonthIncomingCost) / currentStock;

    const existingCurrentCostPrice = await CostPrice.findOne({
        where: {
            id,
            date: invoiceMonthStart,
        },
    });

    if (existingCurrentCostPrice) {
        existingCurrentCostPrice.set('value', currentCostPrice);
        await existingCurrentCostPrice.save();

    } else {
        await CostPrice.create({
            id,
            date: invoiceMonthStart,
            value: currentCostPrice,
        });
    }
};


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