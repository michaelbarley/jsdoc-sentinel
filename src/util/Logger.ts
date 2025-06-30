export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

class Logger {
  private static instance: Logger;

  private constructor() {
  }

  public static get(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private get level(): LogLevel {
    return (process.env.JSDOC_SENTINEL_LOG as LogLevel) ?? "info";
  }

  private shouldPrint(lvl: LogLevel): boolean {
    const order: LogLevel[] = ["debug", "info", "warn", "error", "silent"];
    return order.indexOf(lvl) >= order.indexOf(this.level);
  }

  debug(msg: unknown) {
    if (this.shouldPrint("debug")) {
      console.debug("[JSDS] ", msg);
    }
  }

  info(msg: unknown) {
    if (this.shouldPrint("info")) {
      console.info("[JSDS] ", msg);
    }
  }

  warn(msg: unknown) {
    console.warn("[JSDS] ", msg);
  }

  error(msg: unknown) {
    console.error("[JSDS] ", msg);
  }
}

export const log = Logger.get();
