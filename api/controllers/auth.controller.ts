import { NextFunction, Request, Response } from "express";

import User, { IUser } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;
  const hashedPassword: string = bcryptjs.hashSync(password, 10);

  try {
    const userData: IUser = {
      username,
      email,
      password: hashedPassword,
    };
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error)
  }
};
