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

export const updateTodo = async (req: Request, res: Response) => {
  const todoId = req.params.todoId as string;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(todoId, req.body, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
