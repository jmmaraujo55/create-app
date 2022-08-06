import express from "express";
import morgan from "morgan";
import { PORT } from "src/config/environment";
import logger from "src/utils/logger";
import { Router } from "./routes";

export default class Server {
  app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    new Router(this.app);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(morgan("tiny"));
  }

  listen() {
    this.app.listen(PORT, () => logger.info(`server listen at port ${PORT}`));
  }
}
