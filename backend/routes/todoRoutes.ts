// backend/routes/todoRoutes.ts
import express from "express";
import { getTodos, getTodo, updateTodo } from "../controllers/todoController";

const router = express.Router();

router.get("/api/todos", getTodos);
router.get("/api/todos/:userId", getTodo);
router.put("/api/todos/:todoId", updateTodo);

export default router;
