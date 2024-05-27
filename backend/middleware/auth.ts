import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret_key = process.env.SECRET_KEY!;

interface JwtPayload {
  userId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No authorization header provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Malformed token");
    return res.status(401).json({ message: "Malformed token" });
  }

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      console.log("Token verification failed", err);
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
