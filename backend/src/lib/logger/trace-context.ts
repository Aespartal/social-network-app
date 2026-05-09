import { AsyncLocalStorage } from 'node:async_hooks'
import type { Logger as PinoLogger } from 'pino'

export interface TraceContext {
  requestId: string
  logger: any
}

export const traceStorage = new AsyncLocalStorage<TraceContext>()
