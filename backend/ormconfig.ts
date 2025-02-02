import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./src/entities/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Use DATABASE_URL directly
  synchronize: true, // Set to false in production
  ssl: {
    rejectUnauthorized: false, // Ensure SSL is allowed
  },
  entities: ["src/entities/*.js"],
  logging: false,
  // entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
  subscribers: []
});
