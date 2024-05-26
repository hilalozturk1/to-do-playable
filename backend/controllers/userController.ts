// userController.ts

import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
