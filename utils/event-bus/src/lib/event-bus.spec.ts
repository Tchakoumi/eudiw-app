import EventEmitter from 'eventemitter3';
import { eventBus } from './event-bus';

enum Events {
  Event1 = 'event1',
  Event2 = 'event2',
}

describe('eventBus', () => {
  let callback1: jest.Func, callback2: jest.Func;

  beforeAll(() => {
    callback1 = jest.fn((data) => {
      console.log('Subscriber 1 received event1 with data:', data);
    });
    callback2 = jest.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  });

  it('should be instantiated', () => {
    expect(eventBus).toBeDefined();
    expect(eventBus).toBeInstanceOf(EventEmitter);
  });

  it('Should subscribe to events', () => {
    // Subscriber 1
    eventBus.on(Events.Event1, callback1);

    // Subscriber 2
    eventBus.on(Events.Event2, callback2);

    expect(eventBus.eventNames()).toEqual([Events.Event1, Events.Event2]);
  });

  it('Should publish events', () => {
    const data1 = { message: 'Hello from publisher!' };
    eventBus.emit(Events.Event1, data1);
    expect(callback1).toHaveBeenCalled();
    expect(callback1).toHaveBeenCalledWith(data1);
  });

  it('Should show case the EventBus async behavior', async () => {
    const startTime = Date.now();

    const data2 = { message: 'Hello again from publisher!' };
    eventBus.emit(Events.Event2, data2);
    const elapsedTime = Date.now() - startTime;

    expect(callback2).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(data2);
    expect(elapsedTime).toBeLessThan(1000);
  });
});
