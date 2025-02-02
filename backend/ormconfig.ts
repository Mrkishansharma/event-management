import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Use DATABASE_URL directly
  synchronize: true, // Set to false in production
  ssl: {
    rejectUnauthorized: false, // Ensure SSL is allowed
  },
  entities: ["src/entities/*.ts"],
});
