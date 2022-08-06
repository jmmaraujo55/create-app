import "dotenv/config";
import Application from "src/App";

(async (): Promise<void> => {
  try {
    const app = new Application();
    app.init();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
