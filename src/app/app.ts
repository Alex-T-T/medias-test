import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import path from 'path';

import exeptionsFilter from './middlewares/exception.filter';
import productsRouter from '../products/products.router'
import incomingRouter from '../incoming_invoices/incoming_invoices.router'
import outgoingRouter from '../outgoing_invoices/outgoing_invoices.router'

const app = express();

app.use(logger('dev'));
app.use(cors());

app.use(express.json()); 

const staticFilesPath = path.join(__dirname, '../', 'public');
app.use('/api/v1/public', express.static(staticFilesPath));


app.use('/products', productsRouter)
app.use('/arrivals', incomingRouter)
app.use('/orders', outgoingRouter)

app.use(exeptionsFilter);
export default app;
