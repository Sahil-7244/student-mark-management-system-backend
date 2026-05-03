import { Response } from "express";

const successResponse = <T>(code: number, message: string, results?: T) => ({
  status: true,
  statusCode: code,
  message,
  results
});
const errorResponse = (code: number, message: string) => ({
  status: false,
  statusCode: code,
  message
});
const sendSuccessResponse = <T>(
  res: Response,
  code: number,
  message: string,
  results?: T
) => {
  const response = successResponse(code, message, results);
  return res.status(response.statusCode).json(response);
};
const sendErrorResponse = (res: Response, code: number, message: string) => {
  const response = errorResponse(code, message);
  return res.status(response.statusCode).json(response);
};
export {
  successResponse,
  errorResponse,
  sendSuccessResponse,
  sendErrorResponse
};
