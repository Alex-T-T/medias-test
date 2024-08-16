import { sequelize } from '../db/db.config';

const { QueryTypes } = require('sequelize');

interface ReportRow {
    date: string | null;
    summ: number;
    cost: number;
    profit: number;
    profitability: number;
}

export const generateDailyProfitReport = async (
    startDate: Date,
    endDate: Date
) => {
    const result = await sequelize.query(
        `
        SELECT 
            oip.date,
            SUM(oip.price * oip.quantity) AS summ,
            SUM(cp.value * oip.quantity) AS cost,
            SUM(oip.price * oip.quantity) - SUM(cp.value * oip.quantity) AS profit,
        
           (CASE WHEN SUM(cp.value * oip.quantity) > 0 
      THEN (SUM(oip.price * oip.quantity) - SUM(cp.value * oip.quantity)) / SUM(cp.value * oip.quantity) * 100
      ELSE NULL 
END) AS profitability
        FROM 
            "OutgoingInvoiceProducts" oip
        JOIN 
            "CostPrices" cp ON cp.id = oip.product_id AND cp.date = DATE_TRUNC('month', oip.date)
        WHERE 
            oip.date BETWEEN :startDate AND :endDate
        GROUP BY 
            oip.date
        ORDER BY 
            oip.date ASC;
        `,

        {
            type: QueryTypes.SELECT,
            replacements: { startDate, endDate },
        }
    );

    const report: ReportRow[] = result.map((row: any) => ({
        date: row.date,
        summ: Number(row.summ),
        cost: Number(row.cost),
        profit: Number(row.profit),
        profitability: Number(row.profitability),
    }));

    report.push({
        date: null,
        summ: report.reduce((acc, row) => acc + row.summ, 0),
        cost: report.reduce((acc, row) => acc + row.cost, 0),
        profit: report.reduce((acc, row) => acc + row.profit, 0),
        profitability:
            (report.reduce((acc, row) => acc + row.profit, 0) /
                report.reduce((acc, row) => acc + row.cost, 0)) *
            100,
    });

    return report;
};
