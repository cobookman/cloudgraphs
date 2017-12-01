export default class AbstractDrawing {
  constructor() {
    this.eventHandlers = [];
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
  emit(eventName, payload) {
    (this.eventHandlers[eventName] || []).forEach((handler) => {
      handler(payload);
    });
  }
}
