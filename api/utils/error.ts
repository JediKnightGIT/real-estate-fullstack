import { CustomError } from '../index.js';

export const errorHandler = (statusCode: number, message: string): CustomError => {
  return {
    statusCode,
    message,
  };
};
