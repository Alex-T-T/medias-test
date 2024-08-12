// export const databaseConfiguration = (
//     isMigrationRun = true
// ) => {
//     const ROOT_PATH = process.cwd();

import { Options, Sequelize } from "sequelize";

//     const migrationPath =
//         process.env.NODE_ENV === 'development'
//             ? `${ROOT_PATH}/**/migrations/*{.ts,.js}`
//             : `build/**/migrations/*{.ts,.js}`;

//     const entitiesPath =
//         process.env.NODE_ENV === 'development'
//             ? `${ROOT_PATH}/**/*.entity{.ts,.js}`
//             : `build/**/*.entity{.ts,.js}`;

//     // const config: PostgresConnectionOptions = {
//     //     type: 'postgres',
//     //     host: process.env.POSTGRES_HOST,
//     //     port: +process.env.POSTGRES_PORT!,
//     //     username: process.env.POSTGRES_USER,
//     //     password: process.env.POSTGRES_PASSWORD,
//     //     database: process.env.POSTGRES_DB,
//     //     entities: [entitiesPath],
//     //     migrations: [migrationPath],
//     //     migrationsTableName: 'migrations',
//     //     migrationsRun: isMigrationRun,
//     //     logging: false,
//     //     synchronize: true,
//     // };

//     const config: 

//     return config;
// };


const options: Options = {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
}

export const sequelize = new Sequelize(options)
