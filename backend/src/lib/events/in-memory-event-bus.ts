import { EventEmitter } from 'node:events'
import { injectable } from 'inversify'
import {
  EventBus,
  DomainEvent,
  DomainEventHandler,
} from './event-bus.interface'

@injectable()
export class InMemoryEventBus implements EventBus {
  private readonly emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
    this.emitter.setMaxListeners(100)
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const listeners = this.emitter.listeners(event.eventName)

      await Promise.all(
        listeners.map(listener =>
          Promise.resolve((listener as DomainEventHandler<typeof event>)(event))
        )
      )
    }
  }

  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): void {
    this.emitter.on(eventName, handler)
  }
}
