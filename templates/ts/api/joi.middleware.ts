import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export function joiExample(
  { body }: Request,
  res: Response,
  next: NextFunction
) {
  const result = Joi.object({}).unknown().validate(body);

  if (result.error) return res.status(400).send(result.error.message);

  return next();
}
