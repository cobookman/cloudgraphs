import createjs from 'createjs-cmd';

export default class AbstractDrawing {
  constructor() {
    this.eventHandlers = [];
    this.container = new createjs.Container();
    this.container.setBounds(0, 0, 0, 0);
  }

  get x() {
    return this.container.x;
  }

  set x(newX) {
    this.container.x = (newX < 0) ? 0 : newX;
  }

  get y() {
    return this.container.y;
  }

  set y(newY) {
    this.container.y = (newY < 0) ? 0 : newY;
  }


  // add event handler
  on(eventName, handler) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }

  // remove event handler
  off(eventName, handler) {
    this.eventHandlers[eventName] = (this.eventHandlers[eventName] || []).filter(
      item => item !== handler);
  }

  // emit events to handlers
  emit(eventName, ...args) {
    (this.eventHandlers[eventName] || []).forEach((handler) => {
      handler.apply(handler, args);
    });
  }
}
