import createjs from 'createjs-cmd';
import zones from '@/components/diagramming/zones';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';

export default class GcpProductZone extends AbstractDrawing {
  constructor(params) {
    super();

    // parse params
    this.id = params.id;
    this.zoneName = params.zoneName;
    this.title = params.title;
    this.byline = params.byline || null;
    this.padding = params.padding || { x: 35, y: 15 };
    this.titleFontSize = params.titleFontSize || 37;
    this.bylineFontSize = params.bylineFontSize || 33;

    // instantiate default member values
    this.children = [];
    this.childrenDrawings = [];
    this.zoneType = zones[this.zoneName.toUpperCase()];

    // instantiate drawing elms
    this.titleDrawing = new createjs.Text();
    this.bylineDrawing = new createjs.Text();
    this.zoneDrawing = new createjs.Shape();

    // holds only the child elements
    this.childContainer = new createjs.Container();

    // holds the zone drawing itself
    this.zoneContainer = new createjs.Container();

    // holds all elements
    this.container.x = params.x || 0;
    this.container.y = params.y || 0;

    this.zoneContainer.on('pressmove', this.emit.bind(this, 'pressmove'));
    this.zoneContainer.on('pressup', this.emit.bind(this, 'pressup'));
  }

  toJSON() {
    return {
      id: this.id,
      type: 'GcpProductZone',
      zoneName: this.zoneName,
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
    this.zoneContainer.removeAllChildren();

    // render children
    // let minChildY = 0;
    // let minChildX = 0;
    this.childrenDrawings.forEach((drawing) => {
      this.childContainer.addChild(drawing);
    });

    // render zone
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

    // calculate zone background width
    const childBounds = this.childContainer.getBounds();
    let zoneWidth = childBounds.width + childBounds.x + (this.padding.x * 2);
    if (bylineBounds && bylineBounds.width > zoneWidth) {
      zoneWidth = bylineBounds.width;
    }
    if (titleBounds && titleBounds.width > zoneWidth) {
      zoneWidth = titleBounds.width;
    }
    console.log(this.title, childBounds.height, childBounds.x, zoneWidth);

    // calculate zone background height
    let zoneHeight = childBounds.height + childBounds.y + (this.padding.y * 5);
    if (titleBounds) {
      zoneHeight += titleBounds.height;
    }
    if (bylineBounds) {
      zoneHeight += bylineBounds.height;
    }
    console.log(this.title, childBounds.height, childBounds.y, zoneHeight);

    this.zoneDrawing.graphics
      .clear()
      .beginFill(this.zoneType.background)
      .drawRect(0, 0,
          zoneWidth, zoneHeight);
    this.zoneDrawing.setBounds(0, 0, zoneWidth, zoneHeight);

    // move childDrawings down by the titleBoounds & bylineBounds
    if (this.childContainer.x < this.padding.x) {
      this.childContainer.x = this.padding.x;
    }

    const minChildY = this.padding.y + titleBounds.height;
    if (this.childContainer.y < minChildY) {
      this.childContainer.y = minChildY;
    }

    this.zoneContainer.addChild(
      this.zoneDrawing,
      this.titleDrawing,
      this.bylineDrawing);

    // add drawings to container in order of z-index
    this.container.addChild(
      this.zoneContainer,
      this.childContainer);

    // container bounds same as zone's
    this.container.setBounds(0, 0, zoneWidth, zoneHeight);

    return this.container;
  }

  addChild(child) {
    this.children.push(child);
    this.childrenDrawings.push(child.render());
  }

  // onPressMove(evt) {
  //   console.log('parentMoving');
  //   if (!this.moving) {
  //     this.moving = true;
  //     this.offsets = [];
  //     this.movingOffset = {
  //       x: this.container.x - evt.stageX,
  //       y: this.container.y - evt.stageY,
  //     };
  //     this.movingChildOffsets = this.childDrawings.map((drawing) => {
  //       return {
  //         x: drawing.x - evt.stageX,
  //         y: drawing.y - evt.stageY,
  //       };
  //     });
  //   }
  //
  //   // todo(bookman): calculate where you are on card & offset so less janky
  //   this.container.x = evt.stageX + this.movingOffset.x;
  //   this.container.y = evt.stageY + this.movingOffset.y;
  //   this.x = this.container.x;
  //   this.y = this.container.y;
  //
  //   // change position of all child cards
  //   this.childDrawings.forEach((drawing, i) => {
  //     console.log(this.movingChildOffsets[i]);
  //     drawing.container.x = evt.stageX + this.movingChildOffsets[i].x;
  //     drawing.container.y = evt.stageY + this.movingChildOffsets[i].y;
  //   });
  //   this.stage.update();
  //   (this.onMoveHandlers || []).forEach((handler) => {
  //     handler();
  //   });
  // }
  //
  // onPressUp() {
  //   this.moving = false;
  //   this.movingOffset = {};
  //   this.movingChildOffsets = [];
  // }
}
