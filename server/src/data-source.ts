import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  entities: [
    "src/entities/**/*.ts",
  ],
  synchronize: true,
});

export { AppDataSource };