import createjs from 'createjs-cmd';
import paths from '@/components/diagramming/paths';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';

export default class GcpArrow extends AbstractDrawing {
  constructor(params) {
    super();
    this.from = params.from;
    this.to = params.to;
    this.arrow = params.arrow || 'ARROW_TO';
    this.path = params.path || 'PRIMARY';
    this.optional = params.optional || false;
    this.midpoint = params.midpoint;
    this.fromDrawing = params.fromDrawing;
    this.toDrawing = params.toDrawing;

    this.lineToMidpoint = new createjs.Shape();
    this.lineFromMidpoint = new createjs.Shape();
  }

  toJSON() {
    return {
      from: this.from,
      to: this.to,
      arrow: this.arrow,
      path: this.path,
      optional: this.optional,
      midpoint: this.midpoint,
    };
  }

  render() {
    this.container.removeAllChildren();

    const path = paths[this.path.toUpperCase()];
    this.lineToMidpoint.graphics
      .setStrokeStyle(path.width)
      .beginStroke(path.color)
      .moveTo(this.fromDrawing.x, this.fromDrawing.y)
      .lineTo(this.midpoint.x, this.midpoint.y)
      .lineTo(this.toDrawing.x, this.toDrawing.y)
      .endStroke();

    this.container.addChild(this.lineToMidpoint);
    return this.container;
  }
}
