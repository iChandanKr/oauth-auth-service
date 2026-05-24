import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbUser = process.env.POSTGRES_USER || 'user';
const dbPassword = process.env.POSTGRES_PASSWORD || 'password';
const dbHost = process.env.POSTGRES_HOST || 'postgres';
const dbName = process.env.POSTGRES_DB || 'auth_db';
const dbPort = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
    port: dbPort,
    logging: false, // Set to console.log to see SQL queries
});

export default sequelize;
