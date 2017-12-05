import createjs from 'createjs-cmd';
import groupings from '@/components/diagramming/groupings';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';

export default class GcpProductGrouping extends AbstractDrawing {
  constructor(params) {
    super();

    // parse params
    this.id = params.id;
    this.grouping = params.grouping;
    this.title = params.title;
    this.byline = params.byline || null;
    this.padding = params.padding || { x: 35, y: 15 };
    this.titleFontSize = params.titleFontSize || 37;
    this.bylineFontSize = params.bylineFontSize || 33;

    // instantiate default member values
    this.children = [];
    this.childrenDrawings = [];
    this.groupingInfo = groupings[this.grouping.toUpperCase()];

    // instantiate drawing elms
    this.titleDrawing = new createjs.Text();
    this.bylineDrawing = new createjs.Text();
    this.groupingDrawing = new createjs.Shape();

    // holds only the child elements
    this.childContainer = new createjs.Container();

    // holds the grouping drawing itself
    this.groupingContainer = new createjs.Container();

    // holds all elements
    this.container.x = params.x || 0;
    this.container.y = params.y || 0;

    this.groupingContainer.on('pressmove', this.emit.bind(this, 'pressmove'));
    this.groupingContainer.on('pressup', this.emit.bind(this, 'pressup'));
  }

  toJSON() {
    return {
      id: this.id,
      type: 'GcpProductGrouping',
      grouping: this.grouping,
      title: this.title,
      x: this.x,
      y: this.y,
      padding: this.padding,
      elms: this.children.map(child => child.toJSON()),
    };
  }

  render() {
    // clean up old rendering
    this.container.removeAllChildren();
    this.childContainer.removeAllChildren();
    this.groupingContainer.removeAllChildren();

    // render children
    // let minChildY = 0;
    // let minChildX = 0;
    this.childrenDrawings.forEach((drawing) => {
      this.childContainer.addChild(drawing);
    });

    // render grouping card
    this.titleDrawing.text = this.title || 'hi world';
    this.titleDrawing.color = '#888';
    this.titleDrawing.font = `${this.titleFontSize}px Roboto`;
    this.titleDrawing.x = this.padding.x;
    this.titleDrawing.y = this.padding.y;

    this.bylineDrawing.text = this.byline;
    this.bylineDrawing.color = '#999';
    this.bylineDrawing.font = `${this.bylineFontSize}px Roboto`;
    this.bylineDrawing.x = this.padding.x;
    this.bylineDrawing.y = this.padding.y + 37 + 15;

    const titleBounds = this.titleDrawing.getBounds();
    const bylineBounds = this.bylineDrawing.getBounds();

    // position child elements before rendering background...
    this.childContainer.x = this.bylineDrawing.x;
    this.childContainer.y = this.padding.y * 3;
    if (titleBounds) {
      this.childContainer.y += titleBounds.height;
    }
    if (bylineBounds) {
      this.childContainer.y += bylineBounds.height;
    }

    // calculate grouping background width
    const childBounds = this.childContainer.getBounds();
    let groupingWidth = childBounds.width + childBounds.x + (this.padding.x * 2);
    if (bylineBounds && bylineBounds.width > groupingWidth) {
      groupingWidth = bylineBounds.width;
    }
    if (titleBounds && titleBounds.width > groupingWidth) {
      groupingWidth = titleBounds.width;
    }

    // calculate grouping card background height
    let groupingHeight = childBounds.height + childBounds.y + (this.padding.y * 5);
    if (titleBounds) {
      groupingHeight += titleBounds.height;
    }
    if (bylineBounds) {
      groupingHeight += bylineBounds.height;
    }

    this.groupingDrawing.graphics
      .clear()
      .beginFill(this.groupingInfo.background)
      .drawRect(0, 0,
          groupingWidth, groupingHeight);
    this.groupingDrawing.setBounds(0, 0, groupingWidth, groupingHeight);

    // move childDrawings down by the titleBoounds & bylineBounds
    if (this.childContainer.x < this.padding.x) {
      this.childContainer.x = this.padding.x;
    }

    const minChildY = this.padding.y + titleBounds.height;
    if (this.childContainer.y < minChildY) {
      this.childContainer.y = minChildY;
    }

    this.groupingContainer.addChild(
      this.groupingDrawing,
      this.titleDrawing,
      this.bylineDrawing);

    // add drawings to container in order of z-index
    this.container.addChild(
      this.groupingContainer,
      this.childContainer);

    // container bounds same as grouping card's
    this.container.setBounds(0, 0, groupingWidth, groupingHeight);

    return this.container;
  }

  addChild(child) {
    this.children.push(child);
    this.childrenDrawings.push(child.render());
  }
}
