import { NextFunction, Response } from 'express';
import bcryptjs from 'bcryptjs';

import { errorHandler } from '../utils/error';
import User from '../models/user.model.js';
import { CustomRequest } from '../utils/verifyUser.js';



export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.id !== req.params.id)
    return next(errorHandler(401, 'You can update only your account!'));

    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }

      const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar
        }
      }, { new: true });

      const { password, ...rest } = updateUser?._doc

      res.status(200).json(rest)
    } catch (error: unknown) {
      next(error)
    }
};
