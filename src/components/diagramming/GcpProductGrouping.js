import createjs from 'createjs-cmd';
import groupings from '@/components/diagramming/groupings';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';

export default class GcpProductGrouping extends AbstractDrawing {
  static spec = Object.freeze({
    radius: 2,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    heading: Object.freeze({
      font: '500 16px Roboto',
      lineHeight: 24,
      color: 'rgba(0, 0, 0, 0.38)',
    }),
    subhead: Object.freeze({
      font: '500 12px Roboto',
      lineHeight: 16,
      color: 'rgba(0, 0, 0, 0.38)',
    }),
  });

  constructor(params) {
    super();

    // parse params
    this.id = params.id;
    this.grouping = params.grouping;
    this.heading = params.heading || '';
    this.subhead = params.subhead || '';

    // instantiate default member values
    this.children = [];
    this.childrenDrawings = [];
    this.groupingInfo = groupings[this.grouping.toUpperCase()];

    // instantiate drawing elms
    this.headingDrawing = new createjs.Text();
    this.subheadDrawing = new createjs.Text();
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
      heading: this.heading,
      subhead: this.subhead,
      x: this.x,
      y: this.y,
      padding: this.padding,
      elms: this.children.map(child => child.toJSON()),
    };
  }

  static linesOfText(text) {
    if (!text) {
      return 0;
    }
    return text.split('\n').length;
  }

  render() {
    // clean up old rendering
    this.container.removeAllChildren();
    this.childContainer.removeAllChildren();
    this.groupingContainer.removeAllChildren();

    // render child elements contained in grouping
    this.childrenDrawings.forEach((drawing) => {
      this.childContainer.addChild(drawing);
    });

    // render heading
    this.headingDrawing.text = this.heading;
    this.headingDrawing.color = GcpProductGrouping.spec.heading.color;
    this.headingDrawing.font = GcpProductGrouping.spec.heading.font;
    this.headingDrawing.lineHeight = GcpProductGrouping.spec.heading.lineHeight;
    this.headingDrawing.x = GcpProductGrouping.spec.paddingLeft;
    this.headingDrawing.y = GcpProductGrouping.spec.paddingTop;

    // render subhead
    this.subheadDrawing.text = this.subhead;
    this.subheadDrawing.color = GcpProductGrouping.spec.subhead.color;
    this.subheadDrawing.font = GcpProductGrouping.spec.subhead.font;
    this.subheadDrawing.lineHeight = GcpProductGrouping.spec.subhead.lineHeight;
    this.subheadDrawing.x = GcpProductGrouping.spec.paddingLeft;
    this.subheadDrawing.y = (
      GcpProductGrouping.linesOfText(this.heading) * this.headingDrawing.lineHeight)
      + this.headingDrawing.y;

    // position grouped elements before rendering our grouping card
    this.childContainer.x = GcpProductGrouping.spec.paddingLeft;
    this.childContainer.y = (
      GcpProductGrouping.linesOfText(this.subhead) * this.subheadDrawing.lineHeight)
      + this.subheadDrawing.y;
    if (this.subheadDrawing.text.length) {
      this.childContainer.y += GcpProductGrouping.spec.paddingTop;
    }

    // we have an extra paddingTop if no subhead, so let's remove it
    // if (!this.subhead) {
    //   this.childContainer.y -=
    // }
    // calculate grouping background width
    const childBounds = this.childContainer.getBounds();

    const cardWidth = childBounds.width
      + childBounds.x
      + GcpProductGrouping.spec.paddingLeft
      + GcpProductGrouping.spec.paddingRight;

    // calculate grouping card background height
    const cardHeight = childBounds.height
      + childBounds.y
      + this.childContainer.y
      + GcpProductGrouping.spec.paddingBottom;

    this.groupingDrawing.graphics
      .clear()
      .beginFill(this.groupingInfo.background)
      .drawRoundRect(0, 0,
          cardWidth, cardHeight, 2);
    this.groupingDrawing.setBounds(0, 0, cardWidth, cardHeight);

    this.groupingContainer.addChild(
      this.groupingDrawing,
      this.headingDrawing,
      this.subheadDrawing);

    // add drawings to container in order of z-index
    this.container.addChild(
      this.groupingContainer,
      this.childContainer);

    // container bounds same as grouping card's
    this.container.setBounds(0, 0, cardWidth, cardHeight);

    return this.container;
  }

  addChild(child) {
    this.children.push(child);
    this.childrenDrawings.push(child.render());
  }
}
