export interface Logger {
  info(message: string, context?: object): void
  warn(message: string, context?: object): void
  error(message: string, context?: object | Error, error?: Error): void
  debug(message: string, context?: object): void
  trace(message: string, context?: object): void
}
