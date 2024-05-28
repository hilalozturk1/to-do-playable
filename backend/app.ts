import dotenv from "dotenv";
dotenv.config();
import path from "path";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db";

import { verifyToken } from "./middleware/auth";
import { login } from "./controllers/authController";
import { getUsers } from "./controllers/userController";
import todoRoutes from "./routes/todoRoutes";

const app = express();

const PORT = process.env.PORT || 5000;
connectDB();

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

app.use(bodyParser.json());

app.post("/api/login", login);

app.use("/public", express.static(path.join(__dirname, "public")));

// Protected Routes
app.use(verifyToken);
app.get("/api/users", getUsers);
app.use("/", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
