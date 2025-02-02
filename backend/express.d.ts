import { User } from './entities/User'; // Adjust this import path based on your project structure

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Add user to the request
    }
  }
}
