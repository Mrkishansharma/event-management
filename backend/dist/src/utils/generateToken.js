"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    try {
        return jsonwebtoken_1.default.sign(user, "kishansharma", {
            expiresIn: "24h",
        });
    }
    catch (error) {
        console.log(error);
        console.log(JSON.stringify(error));
        throw error;
    }
};
exports.default = generateToken;
