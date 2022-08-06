import { Router } from "express";
import { joiExample } from "src/server/middlewares/joi.middleware";
import exampleController from "../controllers/example.controller";

export const exampleRoutes = Router();

exampleRoutes.post("/", joiExample, exampleController.example);
