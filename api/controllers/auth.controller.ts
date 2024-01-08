import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import User, { IUser } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import admin from '../firebase/firebase.js';

export const signup = async (
  req: Request<{}, {}, Record<string, string>>,
  res: Response,
  next: NextFunction,
) => {
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
  } catch (error: unknown) {
    next(error);
  }
};

export const signin = async (
  req: Request<{}, {}, Record<string, string>>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    const token: string = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET as Secret);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .cookie('token_type', 'native', { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    next(error);
  }
};

export const signout = async (
  req: Request<{}, {}, Record<string, string>>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie('access_token');
    res.clearCookie('token_type');
    res.status(200).json('User has been logged out!');
  } catch (error: unknown) {
    next(error);
  }
};

export const google = async (
  req: Request<{}, {}, Record<string, string>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Missing or invalid Firebase ID token',
      });
    }

    const idToken = authorizationHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;
    const userInfo = {
      email,
      name,
      picture,
    };
    const user = await User.findOne({ email });

    if (user) {
      const { password: pass, ...rest } = user._doc;
      res.cookie('access_token', idToken, { httpOnly: true }).status(200).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: picture,
      });
      await newUser.save();
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', idToken, { httpOnly: true })
        .cookie('token_type', 'google', { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }

  // try {
  //   const user = await User.findOne({ email: req.body.email });

  //   if (user) {
  //     const token: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET as Secret);
  //     const { password: pass, ...rest } = user._doc;
  //     res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  //   } else {
  //     const generatedPassword =
  //       Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  //     const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
  //     const newUser = new User({
  //       username:
  //         req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
  //       email: req.body.email,
  //       password: hashedPassword,
  //       avatar: req.body.photo,
  //     });
  //     await newUser.save();
  //     const token: string = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as Secret);
  //     const { password: pass, ...rest } = newUser._doc;
  //     res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  //   }
  // } catch (error) {
  //   next(error);
  // }
};
