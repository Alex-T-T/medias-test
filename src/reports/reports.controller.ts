import { Request, Response } from 'express';
import { HttpStatuses } from '../app/enums/http-statuses.enum';
import * as reportsService from './reports.service';

export const getReport = async (req: Request, res: Response) => {
    const from = req.query.from as unknown as Date;
    const to = req.query.to as unknown as Date;

    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const report = await reportsService.generateDailyProfitReport(
        startDate,
        endDate
    );

    res.status(HttpStatuses.OK).json(report);
};
