export class Logger {
  private static message (level: string, message: any) {
    console.log(`[${level}]`, message);
  }
  public log (message: any) {
    Logger.message('LOG', message);
  }
  public debug (message: any) {
    Logger.message('DEBUG', message);
  }
  public info (message: any) {
    Logger.message('INFO', message);
  }
  public warn (message: any) {
    Logger.message('WARN', message);
  }
  public error (error: Error | string) {
    if (error instanceof Error) {
      Logger.message('ERROR', `${error.name}: ${error.message}`);
    } else {
      Logger.message('ERROR', error);
    }
  }
}