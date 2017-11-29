import createjs from 'createjs-cmd';

// List of GCP Products with card info
const rootIconPath = '/static/icons/gcp';
const products = Object.freeze({
  GAE: Object.freeze({
    icon: `${rootIconPath}/Compute/App Engine.svg`,
    name: 'App Engine',
  }),
  GCE: Object.freeze({
    icon: `${rootIconPath}/Compute/Compute Engine.svg`,
    name: 'Compute Engine',
  }),
});

// Handles drawing & interaction of the Card itself
class Card {
  constructor(x, y, scale) {
    this.x = x;
    this.y = y;
    this.scaleFactor = scale;
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

  xpos() {
    return this.x * this.scaleFactor;
  }

  ypos() {
    return this.y * this.scaleFactor;
  }

  scale(scale = this.scaleFactor) {
    this.scaleFactor = scale;
    this.shape.graphics
      .clear()
      .beginFill('#fff')
      .drawRoundRect(this.xpos(), this.ypos(),
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
  constructor(product, x, y, scale) {
    this.product = product;
    this.scaleFactor = scale;
    this.x = x;
    this.y = y;

    this.bitmap = new createjs.Bitmap(product.icon);
    this.scale();
    // this.bitmap.setTransform(this.xpos(), this.ypos(), this.scale, this.scale);
  }

  xpos() {
    // 20px from left of card
    return (this.x + 20) * this.scaleFactor;
  }

  ypos() {
    // 120px from top of card & svg has ~8px of padding-top
    return (this.y + (30 - 8)) * this.scaleFactor;
  }

  scale(scale = this.scaleFactor) {
    this.scaleFactor = scale;
    this.bitmap.setTransform(this.xpos(), this.ypos(), this.scaleFactor, this.scaleFactor);
  }

  elm() {
    return this.bitmap;
  }
}

class TitleDrawing {
  constructor(title, x, y, scaleFactor, fontName, fontSize, fontColor) {
    this.title = title;
    this.scaleFactor = scaleFactor;
    this.fontName = fontName;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.x = x;
    this.y = y;
    this.text = new createjs.Text(this.title);
    this.text.color = this.fontColor;
    this.scale();
  }

  xpos() {
    // 195px from left of card
    return (this.x + 195) * this.scaleFactor;
  }

  ypos() {
    // 40px from top of card
    return (this.y + 35) * this.scaleFactor;
  }

  scale(scale = this.scaleFactor) {
    this.scaleFactor = scale;
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
  constructor(byline, x, y, scaleFactor, fontName, fontSize, fontColor) {
    this.byline = byline;
    this.x = x;
    this.y = y;
    this.scaleFactor = scaleFactor;
    this.fontName = fontName;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.text = new createjs.Text(this.byline);
    this.text.color = this.fontColor;
    this.scale();
  }

  xpos() {
    return (this.x + 195) * this.scaleFactor;
  }

  ypos() {
    return (this.y + 90) * this.scaleFactor;
  }

  scale(scale = this.scaleFactor) {
    this.scaleFactor = scale;
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

  constructor(params, scaleFactor) {
    this.product = GcpProductCard.products[params.product.toUpperCase()];
    this.title = params.title;
    this.byline = params.byline || this.product.name;
    this.x = params.x || null;
    this.y = params.y || null;
    this.scaleFactor = scaleFactor || 1.0;
  }

  draw(stage) {
    this.delete(stage);

    this.card = new Card(this.x, this.y, this.scaleFactor);
    this.icon = new Icon(this.product, this.x, this.y, this.scaleFactor);
    this.titleDrawing = new TitleDrawing(this.title, this.x, this.y,
      this.scaleFactor, 'Roboto', 37, '#212121');
    this.bylineDrawing = new BylineDrawing(this.byline, this.x, this.y,
      this.scaleFactor, 'Roboto', 35, '#757575');

    stage.addChild(
      this.card.elm(),
      this.icon.elm(),
      this.titleDrawing.elm(),
      this.bylineDrawing.elm());
    stage.update();
  }

  scale(scaleFactor) {
    this.card.scale(scaleFactor);
    this.icon.scale(scaleFactor);
    this.titleDrawing.scale(scaleFactor);
    this.bylineDrawing.scale(scaleFactor);
  }

  delete(stage) {
    if (this.card) {
      stage.removeChild(this.card.elm());
    }

    if (this.icon) {
      stage.removeChild(this.icon.elm());
    }

    if (this.titleDrawing) {
      stage.removeChild(this.titleDrawing.elm());
    }

    if (this.bylineDrawing) {
      stage.removeChild(this.bylineDrawing.elm());
    }

    stage.update();
  }
}
