import { EventBus } from './event-bus';

enum Events {
  Event1 = 'event1',
  Event2 = 'event2',
}

describe('eventBus', () => {
  let eventBus: EventBus, callback1: jest.Func, callback2: jest.Func;

  beforeAll(() => {
    eventBus = EventBus.init();
    callback1 = jest.fn((data) => {
      console.log('Subscriber 1 received event1 with data:', data);
    });
    callback2 = jest.fn((data) => {
      console.log('Subscriber 2 received event2 with data:', data);
    });
  });

  it('should be instantiated', () => {
    expect(eventBus).toBeDefined();
    expect(eventBus).toBeInstanceOf(EventBus);
    expect(eventBus).toEqual({ listeners: {} });
  });

  it('Should subscribe to events', () => {
    // Subscriber 1
    eventBus.subscribe(Events.Event1, callback1);

    // Subscriber 2
    eventBus.subscribe(Events.Event2, callback2);

    expect(eventBus).toEqual({
      listeners: { [Events.Event1]: [callback1], [Events.Event2]: [callback2] },
    });
  });

  it('Should publish events', () => {
    const data1 = { message: 'Hello from publisher!' };
    eventBus.publish(Events.Event1, data1);
    expect(callback1).toHaveBeenCalled();
    expect(callback1).toHaveBeenCalledWith(data1);

    const data2 = { message: 'Hello again from publisher!' };
    eventBus.publish(Events.Event2, data2);
    expect(callback2).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(data2);
  });
});
