interface CustomError {
  statusCode: number;
  message: string;
}

export const errorHandler = (
  statusCode: number,
  message: string
): CustomError => {
  return {
    statusCode,
    message,
  };
};
