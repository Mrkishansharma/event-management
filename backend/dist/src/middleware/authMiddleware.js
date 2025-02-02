"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' }); // Send response directly
        return; // Prevents further code execution
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        console.log('decoded', decoded);
        req.body.userAuthorization = decoded; // Attach decoded user to the request object
        next(); // Continue to the next middleware or controller
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid' }); // Send response directly
        return; // Prevents further code execution
    }
};
exports.isAuthenticated = isAuthenticated;
