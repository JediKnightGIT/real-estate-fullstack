import { NextFunction, Response } from 'express';
import bcryptjs from 'bcryptjs';

import { errorHandler } from '../utils/error';
import User from '../models/user.model.js';
import { CustomRequest } from '../utils/verifyUser.js';
import Listing from '../models/listing.model.js';

export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.id !== req.params.id)
    return next(errorHandler(401, 'You can update only your account!'));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true },
    );

    const { password, ...rest } = updateUser?._doc;

    res.status(200).json(rest);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.clearCookie('token_type');
    res.status(200).json('User has been deleted!');
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserListings = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.id === req.params.id) {
    console.log('getUserListings ', req.user.id)
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error: unknown) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error: unknown) {
    next(error);
  }
};
