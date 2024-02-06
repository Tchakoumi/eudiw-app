interface EventListener {
  (data: unknown): void;
}

export class EventBus {
  private static instance: EventBus;
  private listeners: { [event: string]: EventListener[] };

  private constructor() {
    this.listeners = {};
  }

  static init(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  subscribe(event: string, callback: EventListener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  publish(event: string, data: unknown): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        callback(data);
      });
    }
  }
}
