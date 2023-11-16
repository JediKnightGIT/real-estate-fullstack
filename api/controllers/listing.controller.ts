import { NextFunction, Request, Response } from 'express';

import Listing from '../models/listing.model.js';
import { CustomRequest } from '../utils/verifyUser.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteListing = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user?.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error: unknown) {
    next(error);
  }
};

export const updateListing = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const listing = await Listing.findById(req.params.id);
  // console.log('listing', listing)
  // console.log('req.user', req.user)
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user?.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedListing);
  } catch (error: unknown) {
    next(error);
  }
};

export const getListing = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json(listing);
  } catch (error: unknown) {
    next(error);
  }
};

export const getListings = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 9;
    const startIndex = parseInt(req.query.startIndex as string) || 0;

    let offer = req.query.offer as string | { $in: boolean[] };
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished as string | { $in: boolean[] };
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking as string | { $in: boolean[] };
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['rent', 'sale'] };
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort as string || 'createdAt';
    const order = req.query.order || 'desc';

    const query = {
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    };

    const sortQuery: { [key: string]: any } = { [sort]: order };

    const listings = await Listing.find(query).sort(sortQuery).limit(limit).skip(startIndex);
    return res.status(200).json(listings);
  } catch (error: unknown) {
    next(error);
  }
};
