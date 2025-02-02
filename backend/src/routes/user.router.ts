import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.get("/getAllUser", userController.getAllUsers);

export default router; 
