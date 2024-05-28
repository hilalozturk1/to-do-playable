import { Request, Response } from "express";
import Todo from "../models/todo";

export const getTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string;
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

export const uploadImage = async (req: Request, res: Response) => {
  const todoId = req.body.todoId as string;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is missing" });
    }

    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.image = `/public/pictures/${req.file.filename}`;
    await todo.save();
    res.json({ message: "Image uploaded and todo updated successfully", todo });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  const todoId = req.body.todoId as string;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is missing" });
    }

    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.attachment = `/public/attachments/${req.file.filename}`;
    await todo.save();
    res.json({ message: "File uploaded and todo updated successfully", todo });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
