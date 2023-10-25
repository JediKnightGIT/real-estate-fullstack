import { Request, Response } from "express";

export const test = (req: Request, res: Response): void => {
  res.json({
    message: 'Hello World!',
  });
};
