export type EventHandler<T = unknown> = (payload: T) => void;

export class EventBus {
  private readonly listeners: Map<string, Set<EventHandler<unknown>>> = new Map();

  public on<T>(event: string, handler: EventHandler<T>): () => void {
    let handlers = this.listeners.get(event);
    if (!handlers) {
      handlers = new Set();
      this.listeners.set(event, handlers);
    }
    const wrapped = handler as EventHandler<unknown>;
    handlers.add(wrapped);
    return () => {
      this.off(event, wrapped);
    };
  }

  public off(event: string, handler: EventHandler<unknown>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public emit<T>(event: string, payload?: T): void {
    const handlers = this.listeners.get(event);
    if (!handlers) {
      return;
    }
    for (const handler of handlers) {
      handler(payload);
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
