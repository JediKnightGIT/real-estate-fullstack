import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User, { IUser } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

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
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, 'User not found!'));
      return;
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      next(errorHandler(401, 'Invalid credentials!'));
      return;
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  } catch (error: any) {
    next(error);
  }
};
