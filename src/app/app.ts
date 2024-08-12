import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import path from 'path';

import exeptionsFilter from './middlewares/exception.filter';
import productsRouter from '../products/products.router'

const app = express();

app.use(logger('dev'));
app.use(cors());

app.use(express.json()); 

const staticFilesPath = path.join(__dirname, '../', 'public');
app.use('/api/v1/public', express.static(staticFilesPath));


app.use('/products', productsRouter)

app.use(exeptionsFilter);
export default app;
