import pino, { Logger as PinoLogger, Level } from 'pino'
import { injectable } from 'inversify'
import { Logger } from './logger.interface'
import { config } from '@/config/env'
import { traceStorage } from './trace-context'

@injectable()
export class AppLogger implements Logger {
  private readonly rootLogger: PinoLogger

  constructor() {
    this.rootLogger = pino({
      level: config.LOG_LEVEL || 'info',
      redact: ['password', 'token', 'refreshToken'],
      formatters: {
        level: label => ({ level: label.toUpperCase() }),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    })
  }

  private getLogger(): PinoLogger {
    const store = traceStorage.getStore()
    return store?.logger || this.rootLogger
  }

  private log(level: Level, message: string, context?: object): void {
    const logger = this.getLogger()
    if (context) {
      logger[level](context, message)
    } else {
      logger[level](message)
    }
  }

  info(message: string, context?: object): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: object): void {
    this.log('warn', message, context)
  }

  debug(message: string, context?: object): void {
    this.log('debug', message, context)
  }

  trace(message: string, context?: object): void {
    this.log('trace', message, context)
  }

  error(message: string, context?: object | Error, error?: Error): void {
    const logger = this.getLogger()

    if (error) {
      logger.error({ ...context, err: error }, message)
    } else if (context instanceof Error) {
      logger.error({ err: context }, message)
    } else if (context) {
      logger.error(context, message)
    } else {
      logger.error(message)
    }
  }
}
