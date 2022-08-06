import { DateTime } from 'luxon';
import * as colors from 'colors';

class Logger {
  success;
  info;
  warn;
  error;

  constructor() {
    colors.enable();
    colors.setTheme({
      error: ['bgRed', 'bold'],
      success: ['bgGreen', 'bold'],
      info: ['bgBlue', 'bold'],
      warn: ['bgYellow', 'bold'],
    });
    this.success = (...msg: Array<any>) => this._log(' SUCCESS ', 'success', ...msg);
    this.info = (...msg: Array<any>) => this._log(' INFO ', 'info', ...msg);
    this.warn = (...msg: Array<any>) => this._log(' WARN ', 'warn', ...msg);
    this.error = (...msg: Array<any>) => this._log(' ERROR ', 'error', ...msg);
  }

  private _log(level: string, color, ...msg): void {
    console.log(`${DateTime.now().toUTC()} - ${level[color]} >`, ...msg);
  }
}

export default new Logger();
