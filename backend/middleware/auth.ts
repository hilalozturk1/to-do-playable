// backend/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret_key = process.env.SECRET_KEY!;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

    req.body.user = decoded;
    next();
  });
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, secret_key, { expiresIn: '1h' });
};
