// backend/controllers/todoController.ts
import { Request, Response } from "express";
import Todo from "../models/todo";

export const getTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const todos = await Todo.find({ user: userId });
    res.json(todos);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
