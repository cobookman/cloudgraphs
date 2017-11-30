import createjs from 'createjs-cmd';
import products from '@/components/diagramming/products';

// Handles drawing & interaction of the Card itself
class Card {
  constructor(scaleFactor) {
    this.scaleFactor = scaleFactor;
    this.shape = new createjs.Shape();
    this.radius = 2;
    this.scale();
  }

  width() {
    return 530 * this.scaleFactor;
  }

  height() {
    return 170 * this.scaleFactor;
  }

  scale(scaleFactor = this.scaleFactor) {
    this.scaleFactor = scaleFactor;
    this.shape.graphics
      .clear()
      .beginFill('#fff')
      .drawRoundRect(0, 0,
          this.width(), this.height(), this.radius);

    const shadowOffsetX = 1 * this.scaleFactor;
    const shadowOffsetY = 2 * this.scaleFactor;
    const shadowBlur = 9 * this.scaleFactor;
    this.shape.shadow = new createjs.Shadow('#777',
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur);
  }

  elm() {
    return this.shape;
  }
}

// Handles drawing & interaction of the product icon
class Icon {
  constructor(product, scaleFactor) {
    this.product = product;
    this.scaleFactor = scaleFactor;

    this.bitmap = new createjs.Bitmap(product.icon);
    this.scale();
    // this.bitmap.setTransform(this.xpos(), this.ypos(), this.scale, this.scale);
  }

  xpos() {
    return 20 * this.scaleFactor;
  }

  ypos() {
    return (30 - 8) * this.scaleFactor;
  }

  scale(scaleFactor = this.scaleFactor) {
    this.scaleFactor = scaleFactor;
    this.bitmap.setTransform(this.xpos(), this.ypos(), this.scaleFactor, this.scaleFactor);
  }

  elm() {
    return this.bitmap;
  }
}

class TitleDrawing {
  constructor(title, fontName, fontSize, fontColor, scaleFactor) {
    this.title = title;
    this.scaleFactor = scaleFactor;
    this.fontName = fontName;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.text = new createjs.Text(this.title);
    this.text.color = this.fontColor;
    this.scale();
  }

  xpos() {
    return 195 * this.scaleFactor;
  }

  ypos() {
    return 35 * this.scaleFactor;
  }

  scale(scaleFactor = this.scaleFactor) {
    this.scaleFactor = scaleFactor;
    const fontSize = this.fontSize * this.scaleFactor;
    this.text.font = `${fontSize}px ${this.fontName}`;
    this.text.x = this.xpos();
    this.text.y = this.ypos();
  }

  elm() {
    return this.text;
  }
}

class BylineDrawing {
  constructor(byline, fontName, fontSize, fontColor, scaleFactor) {
    this.byline = byline;
    this.scaleFactor = scaleFactor;
    this.fontName = fontName;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.text = new createjs.Text(this.byline);
    this.text.color = this.fontColor;
    this.scale();
  }

  xpos() {
    return 195 * this.scaleFactor;
  }

  ypos() {
    return 90 * this.scaleFactor;
  }

  scale(scaleFactor = this.scaleFactor) {
    this.scaleFactor = scaleFactor;
    const fontSize = this.fontSize * this.scaleFactor;
    this.text.font = `${fontSize}px ${this.fontName}`;
    this.text.x = this.xpos();
    this.text.y = this.ypos();
  }

  elm() {
    return this.text;
  }
}

export default class GcpProductCard {
  // make it so products is static const
  static get products() {
    return products;
  }

  constructor(params, stage, scaleFactor) {
    this.productAcronym = params.productAcronym;
    this.product = GcpProductCard.products[this.productAcronym.toUpperCase()];
    this.title = params.title;
    this.byline = params.byline;
    this.x = params.x || null;
    this.y = params.y || null;
    this.stage = stage;
    this.scaleFactor = scaleFactor || 1.0;
  }

  toJSON() {
    return {
      productAcronym: this.productAcronym,
      title: this.title,
      byline: this.byline,
      x: this.x,
      y: this.y,
    };
  }

  on(eventName, handler) {
    if (eventName === 'move') {
      this.onMoveHandlers = this.onMoveHandlers || [];
      this.onMoveHandlers.push(handler);
    }
  }

  draw() {
    this.delete();

    this.card = new Card(this.scaleFactor);
    this.icon = new Icon(this.product, this.scaleFactor);
    this.titleDrawing = new TitleDrawing(this.title,
      'Roboto', 37, '#212121', this.scaleFactor);

    const bylineText = this.byline || this.product.name;
    this.bylineDrawing = new BylineDrawing(bylineText,
      'Roboto', 35, '#757575', this.scaleFactor);
    this.container = new createjs.Container();
    this.container.x = this.x;
    this.container.y = this.y;
    // this.container.x = this.card.xpos();
    // this.container.y = this.card.ypos();

    this.container.addChild(
      this.card.elm(),
      this.icon.elm(),
      this.titleDrawing.elm(),
      this.bylineDrawing.elm());

    this.stage.addChild(this.container);
    this.container.on('pressmove', this.onPressMove.bind(this));
    this.container.on('pressup', this.onPressUp.bind(this));
    this.stage.update();
  }

  onPressMove(evt) {
    if (!this.moving) {
      this.moving = true;
      this.movingOffsetX = this.container.x - evt.stageX;
      this.movingOffsetY = this.container.y - evt.stageY;
    }

    // todo(bookman): calculate where you are on card & offset so less janky
    this.container.x = evt.stageX + this.movingOffsetX;
    this.container.y = evt.stageY + this.movingOffsetY;
    this.x = this.container.x;
    this.y = this.container.y;
    this.stage.update();
    (this.onMoveHandlers || []).forEach((handler) => {
      handler();
    });
  }

  onPressUp() {
    this.moving = false;
  }

  scale(scaleFactor) {
    this.card.scale(scaleFactor);
    this.icon.scale(scaleFactor);
    this.titleDrawing.scale(scaleFactor);
    this.bylineDrawing.scale(scaleFactor);
    this.container.x = this.x * scaleFactor;
    this.container.y = this.y * scaleFactor;
  }

  delete() {
    if (this.container) {
      this.stage.removeChild(this.container);
    }

    this.stage.update();
  }
}
