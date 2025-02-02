"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL, // Use DATABASE_URL directly
    synchronize: true, // Set to false in production
    ssl: {
        rejectUnauthorized: false, // Ensure SSL is allowed
    },
    // entities: ["src/entities/*.ts"],
    logging: false,
    // entities: ["dist/entities/*.js"],
    migrations: ["dist/migrations/*.js"],
    subscribers: []
});
