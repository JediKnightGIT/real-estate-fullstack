import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

import User from '../models/user.model';
import { errorHandler } from './error';

export interface CustomRequest extends Request {
  cookies: {
    access_token: string;
    token_type: string;
  };
  user?: JwtPayload;
  body: Record<string, string>;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  if (req.cookies.token_type === 'google') {
    // If the token is a Google token, the token has already been verified by Firebase Authentication
    // You can access the user information from the decoded token directly
    const { email, name, picture } = jwt.decode(token) as Record<string, string>;

    // Find the corresponding user in MongoDB using the email
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(401, 'Unauthorized'));

    const userInfo = {
      email,
      name,
      picture,
    };
    req.user = userInfo as JwtPayload;
    req.user.id = user._id.toString() as JwtPayload;
  } else {
    // If the token is not a Google token, verify the token using the JWT_SECRET and handle the result
    jwt.verify(token, process.env.JWT_SECRET as Secret, (err, user) => {
      if (err) return next(errorHandler(403, 'Forbidden'));
      req.user = user as JwtPayload;
      console.log(req.user);
    });
  }

  next();
};
