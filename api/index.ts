import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'

import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import listingRoute from './routes/listing.route.js';

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

const __dirname = path.resolve();

const app: Application = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// try {
//   const con = await mongoose.connect(process.env.MONGO_LOCAL || '');
//   console.log('Connected to MongoDB!');
// } catch (error: unknown) {
//   console.error(error);
// }

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listing', listingRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
