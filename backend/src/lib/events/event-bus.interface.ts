export interface DomainEvent {
  eventName: string
  occurredOn: Date
}

export type DomainEventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => Promise<void> | void

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>
  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>
  ): void
}
