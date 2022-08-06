import { Request, Response } from "express";
import { exampleFunction } from "src/server/services/example.service";
import logger from "src/utils/logger";

export default new (class ExampleController {
  async example(req: Request, res: Response) {
    try {
      await exampleFunction();
      return res.status(200).send("ok");
    } catch (error) {
      logger.error(error);
      return res.status(500).send("Something went wrong.");
    }
  }
})();
