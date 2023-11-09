import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

import { errorHandler } from './error';

export interface CustomRequest extends Request {
  cookies: {
    access_token: string;
  };
  user?: JwtPayload;
  body: Record<string, string>
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Retrieve the access token from the cookies
  const token = req.cookies.access_token;

  // Check if the token exists
  if (!token) {
    // If the token does not exist, return an error response
    return next(errorHandler(401, 'Unauthorized'));
  }

  // Verify the token using the JWT_SECRET and handle the result
  jwt.verify(token, process.env.JWT_SECRET as Secret, (err, user) => {
    // If there is an error during token verification, return a forbidden error response
    if (err) return next(errorHandler(403, 'Forbidden'));

    // If the token is successfully verified, assign the user object to the request object
    req.user = user as JwtPayload;

    // Call the next middleware function
    next();
  });
};
