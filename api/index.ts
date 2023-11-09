import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';

export type CustomError = {
  statusCode: number;
  message: string;
};

dotenv.config();

mongoose
  .connect(process.env.MONGO || '')
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err: Error) => {
    console.log(err);
  });

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
