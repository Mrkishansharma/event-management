import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;  // You can define the user type here
}

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });  // Send response directly
    return; // Prevents further code execution
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    console.log('decoded',decoded)
    req.body.userAuthorization = decoded; // Attach decoded user to the request object
    next();  // Continue to the next middleware or controller
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });  // Send response directly
    return; // Prevents further code execution
  }
};
