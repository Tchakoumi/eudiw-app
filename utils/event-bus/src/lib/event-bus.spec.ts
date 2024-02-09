import EventEmitter from 'eventemitter3';
import eventBus from './event-bus';

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
    callback2 = jest.fn(async (data) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          console.time(`Subscriber 2 received event2 with ${data}`);
          resolve(1);
        }, 5000);
      });
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

    const data2 = { message: 'Hello again from publisher!' };
    eventBus.emit(Events.Event2, data2);
    expect(callback2).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(data2);
  });
});
