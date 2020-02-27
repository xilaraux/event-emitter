import EventEmitter from './EventEmitter';

describe('EventEmitter', () => {
  test('should be able to emit an event', () => {
    const emitter = new EventEmitter();
    let expected = false;

    const stub = jest.fn(() => {
      expected = true;
    });

    emitter.on('event', stub);

    emitter.emit('event');

    expect(expected).toBeTruthy();
    expect(stub).toBeCalled();
  });

  test('should be able to remove an event', () => {
    const fn = jest.fn();
    const emitter = new EventEmitter();
    emitter.on('event', fn);
    emitter.off('event', fn);
    emitter.emit('event');
    expect(fn).toBeCalledTimes(0);
  });

  test('should be able to remove all events', () => {
    const emitter = new EventEmitter();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    emitter.on('event', fn1);
    emitter.on('event', fn2);
    emitter.off('event');
    emitter.emit('event');
    expect(fn1).toBeCalledTimes(0);
    expect(fn2).toBeCalledTimes(0);
  });

  test('should be able to fire an event specified amount of time', () => {
    const emitter = new EventEmitter();

    const fn1 = jest.fn();
    emitter.on('event', fn1, 1);

    const fn2 = jest.fn();
    emitter.on('event', fn2, 2);

    emitter.emit('event');
    expect(fn1).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);

    emitter.emit('event');
    expect(fn1).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(2);
  });
});
