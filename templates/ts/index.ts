import "dotenv/config";
import Application from "src/App";
import logger from "src/utils/logger";

(async (): Promise<void> => {
  try {
    const app = new Application();
    app.init();
  } catch (error) {
    logger.success(error);
    process.exit(1);
  }
})();
