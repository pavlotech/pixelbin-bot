export class Logger {
  private static getCurrentTime (): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `\x1b[90m[${hours}:${minutes}:${seconds}]\x1b[0m`; // Серый цвет для времени
  }
  private static message (level: string, message: any, color: string) {
    const levelColor = color;
    console.log(`${Logger.getCurrentTime()}${levelColor} [${level}]`, message, '\x1b[37m');
  }
  public log (message: any) {
    Logger.message('LOG', message, '\x1b[37m'); // Белый цвет для LOG
  }
  public debug (message: any) {
    Logger.message('DEBUG', message, '\x1b[32m'); // Зеленый цвет для DEBUG
  }
  public info (message: any) {
    Logger.message('INFO', message, '\x1b[32m'); // Зеленый цвет для INFO
  }
  public warn (message: any) {
    Logger.message('WARN', message, '\x1b[33m'); // Желтый цвет для WARN
  }
  public error (error: any) {
    Logger.message('ERROR', `${error.name}: ${error.message}\x1b[0m`, '\x1b[31m');
  }
}
