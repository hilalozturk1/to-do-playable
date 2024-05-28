import express from "express";
import multer from "multer";
import path from "path";

import {
  getTodos,
  getTodo,
  updateTodo,
  uploadFile,
  uploadImage,
} from "../controllers/todoController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public");
    const subFolder = file.fieldname === "image" ? "pictures" : "attachments";
    const folderPath = path.join(uploadPath, subFolder);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/api/todos", getTodos);
router.get("/api/todos/:userId", getTodo);
router.put("/api/todos/:todoId", updateTodo);
router.post("/api/public/file", upload.single("file"), uploadFile);
router.post("/api/public/image", upload.single("image"), uploadImage);

export default router;
