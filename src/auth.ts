import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
dotenv.config();

export function generateAccessToken(user: { name: string }): string {
  return jwt.sign(user, process.env.TOKEN_SECRET!);
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Authorization header is required
  if (token == null) {
    return res.sendStatus(401);
  }

  // Verify the token
  jwt.verify(token, process.env.TOKEN_SECRET!, (err: any, decoded: any) => {
    // If the token is invalid, return a 403 Forbidden status
    if (err) return res.sendStatus(403);
    console.log(decoded);
    next();
  });
}
