

import { Options, Sequelize } from "sequelize";

const options: Options = {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
}

export const sequelize = new Sequelize(options)
