import { Logger } from "./Logger";

export class LoggerConsole implements Logger {
  log(message: string) {
    console.log(message);
  }
}
