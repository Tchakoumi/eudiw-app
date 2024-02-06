import { EventBus } from './event-bus';

describe('eventBus', () => {
  const eventBus = EventBus.init();

  it('should be instantiated', () => {
    expect(eventBus).toBeDefined();
    expect(eventBus).toEqual({ listeners: {} });
  });

  it('Should subscribe to events', () => {
    // Subscriber 1
    const callback1 = jest.fn((data) => {
      console.log('Subscriber 1 received event1 with data:', data);
    });
    eventBus.subscribe('event1', callback1);

    // Subscriber 2
    const callback2 = jest.fn((data) => {
      console.log('Subscriber 2 received event2 with data:', data);
    });
    eventBus.subscribe('event2', callback2);

    expect(eventBus).toEqual({
      listeners: { event1: [callback1], event2: [callback2] },
    });
  });
});
