import pino, { Logger as PinoLogger } from 'pino'
import { injectable } from 'inversify'
import { Logger } from './logger.interface'
import { config } from '@/config/env'

@injectable()
export class AppLogger implements Logger {
  private logger: PinoLogger

  constructor() {
    this.logger = pino({
      level: config.LOG_LEVEL || 'info',
      redact: ['password', 'token', 'refreshToken', 'email'],
      formatters: {
        level: label => {
          return { level: label.toUpperCase() }
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    })
  }

  info(message: string, context?: object): void {
    if (context) {
      this.logger.info(context, message)
    } else {
      this.logger.info(message)
    }
  }

  warn(message: string, context?: object): void {
    if (context) {
      this.logger.warn(context, message)
    } else {
      this.logger.warn(message)
    }
  }

  error(message: string, context?: object | Error, error?: Error): void {
    if (error) {
      this.logger.error({ ...context, err: error }, message)
    } else if (context instanceof Error) {
      this.logger.error({ err: context }, message)
    } else if (context) {
      this.logger.error(context, message)
    } else {
      this.logger.error(message)
    }
  }

  debug(message: string, context?: object): void {
    if (context) {
      this.logger.debug(context, message)
    } else {
      this.logger.debug(message)
    }
  }

  trace(message: string, context?: object): void {
    if (context) {
      this.logger.trace(context, message)
    } else {
      this.logger.trace(message)
    }
  }
}
