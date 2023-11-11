import { NextFunction, Request, Response } from 'express';
import Listing from '../models/listing.model.js';

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error: unknown) {
    next(error);
  }
};
