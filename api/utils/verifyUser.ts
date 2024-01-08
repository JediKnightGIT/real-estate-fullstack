import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

import { errorHandler } from './error';

export interface CustomRequest extends Request {
  cookies: {
    access_token: string;
    token_type: string;
  };
  user?: JwtPayload;
  body: Record<string, string>
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  if (req.cookies.token_type === 'google') {
    // If the token is a Google token, the token has already been verified by Firebase Authentication
    // You can access the user information from the decoded token directly
    const result = jwt.decode(token) as { email: string; name: string; picture: string };
    // const userInfo = {
    //   email,
    //   name,
    //   picture,
    // };

    // Assign the user object to the request object
    req.user = result as JwtPayload;
  } else {
    // If the token is not a Google token, verify the token using the JWT_SECRET and handle the result
    jwt.verify(token, process.env.JWT_SECRET as Secret, (err, user) => {
      if (err) return next(errorHandler(403, 'Forbidden'));
      req.user = user as JwtPayload;
    });
  }

  // jwt.verify(token, process.env.JWT_SECRET as Secret, (err, user) => {
  //   if (err) return next(errorHandler(403, 'Forbidden'));

  //   req.user = user as JwtPayload;
  //   next();
  // });

  next();
};
