import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",

  host: "127.0.0.1",

  port: 1433,

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  synchronize: true,

  logging: true,

  entities: ["src/entities/*.ts"],

  extra: {
    trustServerCertificate: true,
    encrypt: false,
  },
});