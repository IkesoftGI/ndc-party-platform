// ndc-backend\src\controllers\usersController.ts

import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { User } from "../models/User";
import { hashPassword, comparePassword, signToken } from "../utils/auth";

const required = (v?: any) => (v === undefined || v === null || v === "" ? false : true);

// POST /api/users/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, region, constituency } = req.body;

  if (!required(name) || !required(email) || !required(password)) {
    return res.status(400).json({ error: "name, email, and password are required" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || "member",
    region,
    constituency
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    region: user.region,
    constituency: user.constituency,
    createdAt: user.createdAt
  });
});

// POST /api/users/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!required(email) || !required(password)) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }

  const token = signToken({ sub: user.id, role: user.role }, secret, "7d");

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


// GET /api/users (basic list, no auth yet)
export const list = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).limit(200);
  res.json(users);
});
