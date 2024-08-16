import express from 'express';
import controllerWrapper from '../app/utils/controller-wrapper';
import validator from '../app/middlewares/validation.middleware';
import * as reportsController from './reports.controller';
import { queryParamSchema } from './reports.schema';

const router = express.Router();

router.get(
    '/',
    validator.query(queryParamSchema),
    controllerWrapper(reportsController.getReport)
);

export default router;
