import createjs from 'createjs-cmd';
import zones from '@/components/diagramming/zones';

export default class GcpProductZone {
  constructor(params) {
    // parse params
    this.id = params.id;
    this.zoneName = params.zoneName;
    this.title = params.title;
    this.byline = params.byline || null;
    this.x = params.x || 0;
    this.y = params.y || 0;
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
    this.container = new createjs.Container();
    this.childContainer = new createjs.Container();
    // this.container.setBounds(0, 0, 0, 0);
    // this.childContainer.setBounds(0, 0, 0, 0);
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
    // render children
    this.childContainer.removeAllChildren();
    this.childrenDrawings.forEach((drawing) => {
      this.childContainer.addChild(drawing);
    });

    // render zone
    this.container.removeAllChildren();

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

    // calculate zone background width & height
    const childBounds = this.childContainer.getBounds();
    let zoneWidth = childBounds.width + (this.padding.x * 2);
    if (bylineBounds && bylineBounds.width > zoneWidth) {
      zoneWidth = bylineBounds.width;
    }
    if (titleBounds && titleBounds.width > zoneWidth) {
      zoneWidth = titleBounds.width;
    }

    let zoneHeight = (this.padding.y * 5) + childBounds.height;
    if (titleBounds) {
      zoneHeight += titleBounds.height;
    }
    if (bylineBounds) {
      zoneHeight += bylineBounds.height;
    }

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

    // add drawings to container in order of z-index
    this.container.addChild(
      this.zoneDrawing,
      this.titleDrawing,
      this.bylineDrawing,
      this.childContainer);

    // container bounds same as zone's
    this.container.x = this.x;
    this.container.y = this.y;
    this.container.setBounds(this.x, this.y, zoneWidth, zoneHeight);

    return this.container;

    // // container.on('pressmove', this.onPressMove.bind(this));
    // // container.on('pressup', this.onPressUp.bind(this));
    // return container;
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
