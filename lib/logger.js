const colors = require("colors");

class Logger {
  success;
  info;
  warn;
  error;

  constructor() {
    colors.enable();
    colors.setTheme({
      error: ["bgRed", "bold"],
      success: ["bgGreen", "bold"],
      info: ["bgBlue", "bold"],
    });
    this.success = (...msg) => this.#log(" SUCCESS ", "success", ...msg);
    this.info = (...msg) => this.#log(" INFO ", "info", ...msg);
    this.error = (...msg) => this.#log(" ERROR ", "error", ...msg);
  }

  #log(level, color, ...msg) {
    console.log(`${level[color]} >`, ...msg);
  }
}

export default new Logger();
