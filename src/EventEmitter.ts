interface IEventEmitter {
  emit(event: string): void;
  on(event: string, cb: ICallable<IEvent, void>, callLimit: number): void;
  off(event: string, cb: ICallable<IEvent, void>): void;
}

type ICallable<K, R> = (arg: K) => R;
type IEmitterFn = ICallable<IEvent, void>;

interface IEvent {
  type: string;
}

interface IEventMap<K, V> {
  [key: string]: Map<K, V>;
}

const NO_LIMIT = -1;

export default class EventEmitter implements IEventEmitter{
  private readonly events: IEventMap<IEmitterFn, number>;

  constructor() {
    this.events = {};
  }

  public on(event: string, fn: IEmitterFn, callLimit: number = NO_LIMIT) {
    if (!this.events[event]) {
      this.events[event] = new Map();
    }

    if (this.events[event].has(fn)) {
      return;
    }

    this.events[event].set(fn, callLimit);
  }

  public off(event: string, fn: IEmitterFn = null) {
    if (!this.events[event]) return;

    if (fn === null) {
      this.offAll(event);
    } else {
      this.offOne(event, fn);
    }
  }

  private offAll(event: string) {
    this.events[event].clear();
  }

  private offOne(event: string, fn: IEmitterFn) {
    if (this.events[event].has(fn)) {
      this.events[event].delete(fn);
    }
  }

  public emit(event: string) {
    if (!this.events[event]) {
      return;
    }

    const listeners = this.events[event];
    const eventObj = { type: event };
    for (const fn of listeners.keys()) {
      const counter = listeners.get(fn);
      if (counter === 0) {
        this.offOne(event, fn);
        continue;
      }

      fn(eventObj);

      if (counter !== NO_LIMIT) {
        listeners.set(fn, counter - 1);
      }
    }
  }
};
