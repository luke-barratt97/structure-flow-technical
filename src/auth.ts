import crypto from "crypto";
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
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET!, (err: any, decoded: any) => {
    if (err) return res.sendStatus(403);
    console.log(decoded);
    next();
  });
}
