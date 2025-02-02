import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json(users);
  }

  async registerUser(req: Request, res: Response): Promise<any> {
    const { name, email, password } = req.body;

    // // Check if user already exists
    const existingUser = await AppDataSource.getRepository(User).findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    else {
      // // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // // Create new user instance
      const userRepository = AppDataSource.getRepository(User);
      const user = userRepository.create({ name, email, password_hash: hashedPassword, role: UserRole.ADMIN });

      // Save to database
      await userRepository.save(user);

      return res.status(201).json({
        error: false,
        message: 'registration succussfull'
      });
    }
  }

  async loginUser(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);

      // Find user by email
      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(401).json({
          error: true,
          message: 'User Not Found'
        });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          error: true,
          message: 'Invalid Password'
        });
      }

      // Generate JWT token
      const token = generateToken({ id: user.id, role: user.role });

      return res.status(200).json({
        error: false,
        message: 'Login Succussfull',
        body: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token, // Send the token in response
        }
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({
        error: true,
        message: 'Internal Server Error'
      });
    }
  }
}
