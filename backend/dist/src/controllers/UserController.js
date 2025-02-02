"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const ormconfig_1 = require("../../ormconfig");
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
            const users = yield userRepository.find();
            res.json(users);
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            // // Check if user already exists
            const existingUser = yield ormconfig_1.AppDataSource.getRepository(User_1.User).findOneBy({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }
            else {
                // // Hash the password
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                // // Create new user instance
                const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
                const user = userRepository.create({ name, email, password_hash: hashedPassword });
                // Save to database
                yield userRepository.save(user);
                return res.status(201).json({
                    error: false,
                    message: 'registration succussfull'
                });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
                // Find user by email
                const user = yield userRepository.findOneBy({ email });
                if (!user) {
                    return res.status(401).json({
                        error: true,
                        message: 'User Not Found'
                    });
                }
                // Check if password is correct
                const isMatch = yield bcrypt_1.default.compare(password, user.password_hash);
                if (!isMatch) {
                    return res.status(401).json({
                        error: true,
                        message: 'Invalid Password'
                    });
                }
                // Generate JWT token
                const token = (0, generateToken_1.default)({ id: user.id, role: user.role });
                return res.status(200).json({
                    error: false,
                    message: 'Login Succussfull',
                    body: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        token, // Send the token in response
                    }
                });
            }
            catch (error) {
                console.error("Error logging in user:", error);
                return res.status(500).json({
                    error: true,
                    message: 'Internal Server Error'
                });
            }
        });
    }
}
exports.UserController = UserController;
