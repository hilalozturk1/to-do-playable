// backend/app.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import connectDB from "./db";

import { verifyToken } from "./middleware/auth";
import { login } from "./controllers/authController";
import { getUsers } from "./controllers/userController";
import todoRoutes from "./routes/todoRoutes";

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.MONGO_URI!);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(verifyToken);

// Routes
app.use("/", todoRoutes);

app.post("/api/login", login);
app.get("/api/users", getUsers);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
