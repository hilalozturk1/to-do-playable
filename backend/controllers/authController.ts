// backend/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

const secret_key = process.env.SECRET_KEY!;

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password }).exec();
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, secret_key, { expiresIn: "1h" });
    res.json({ token, userId: user.id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
