"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./src/entities/User");
const Event_1 = require("./src/entities/Event");
const Location_1 = require("./src/entities/Location");
const EventRegistration_1 = require("./src/entities/EventRegistration");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL, // Use DATABASE_URL directly
    synchronize: true, // Set to false in production
    ssl: {
        rejectUnauthorized: false, // Ensure SSL is allowed
    },
    entities: [User_1.User, Event_1.Event, Location_1.Location, EventRegistration_1.EventRegistration],
    logging: false,
    // entities: ["dist/entities/*.js"],
    migrations: ["dist/migrations/*.js"],
    subscribers: []
});
