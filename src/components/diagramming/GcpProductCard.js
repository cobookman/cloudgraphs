import createjs from 'createjs-cmd';
import products from '@/components/diagramming/products';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';

export default class GcpProductCard extends AbstractDrawing {
  // make it so products is static const
  static get products() {
    return products;
  }

  static spec = Object.freeze({
    cornerRadius: 2,
    minWidth: 530,
    minHeight: 170,
    background: '#FFF',
    paddingTop: 16,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 16,
    shadow: Object.freeze({
      color: 'rgba(0, 0, 0, 0.25)',
      depth: '2dp',
    }),
    heading: Object.freeze({
      font: '17px Roboto',
      lineHeight: 17,
      color: '#212121',
    }),
    subhead: Object.freeze({
      font: '16px Roboto',
      lineHeight: 16,
      color: '#757575',
    }),
  });

  constructor(params) {
    super();
    this.id = params.id;
    this.product = params.product;
    this.heading = params.heading || '';
    this.subhead = params.subhead || '';

    this.cardDrawing = new createjs.Shape();
    this.iconDrawing = new createjs.Bitmap();
    this.headingDrawing = new createjs.Text();
    this.subheadDrawing = new createjs.Text();

    this.container.x = params.x || 0;
    this.container.y = params.y || 0;
    this.container.on('pressmove', this.emit.bind(this, 'pressmove'));
    this.container.on('pressup', this.emit.bind(this, 'pressup'));
  }

  toJSON() {
    return {
      id: this.id,
      type: 'GcpProductCard',
      product: this.product,
      heading: this.heading,
      subhead: this.subhead,
      x: this.x,
      y: this.y,
    };
  }

  render() {
    this.container.removeAllChildren();
    const productInfo = GcpProductCard.products[this.product.toUpperCase()];
    const cardHeight = GcpProductCard.spec.heading.lineHeight
      + GcpProductCard.spec.subhead.lineHeight
      + (GcpProductCard.spec.paddingTop / 2)
      + GcpProductCard.spec.paddingTop
      + GcpProductCard.spec.paddingBottom;
    const imageScaledWidth = (cardHeight
      - GcpProductCard.spec.paddingTop
      - GcpProductCard.spec.paddingBottom);

    // icon. all icons are 128x128 and have 6.5px of hardcoded top & bottom padding.
    const image = document.createElement('img');
    image.src = productInfo.icon;
    image.width = 128;
    image.height = 128;

    this.iconDrawing.image = image;
    this.iconDrawing.scaleX = (imageScaledWidth) / (image.height - (6.5 * 2));
    this.iconDrawing.scaleY = this.iconDrawing.scaleX;
    this.iconDrawing.x = GcpProductCard.spec.paddingLeft;
    this.iconDrawing.y = GcpProductCard.spec.paddingTop - (6.5 * this.iconDrawing.scaleX);

    // heading
    this.headingDrawing.text = this.heading;
    this.headingDrawing.color = GcpProductCard.spec.heading.color;
    this.headingDrawing.font = GcpProductCard.spec.heading.font;
    this.headingDrawing.lineHeight = GcpProductCard.spec.heading.lineHeight;
    this.headingDrawing.x = this.iconDrawing.x + imageScaledWidth + (
      GcpProductCard.spec.paddingLeft * 3);
    this.headingDrawing.y = GcpProductCard.spec.paddingTop;

    // subhead
    this.subheadDrawing.text = this.subhead || productInfo.name;
    this.subheadDrawing.color = GcpProductCard.spec.subhead.color;
    this.subheadDrawing.font = GcpProductCard.spec.subhead.font;
    this.headingDrawing.lineHeight = GcpProductCard.spec.subhead.lineHeight;
    this.subheadDrawing.x = this.headingDrawing.x;
    this.subheadDrawing.y = this.headingDrawing.y + this.headingDrawing.lineHeight
      + (GcpProductCard.spec.paddingTop / 2);

    // calc width for card
    const headingBounds = this.headingDrawing.getBounds();
    const subheadBounds = this.subheadDrawing.getBounds();
    let cardWidth = this.headingDrawing.x + headingBounds.width;
    if (subheadBounds.width > headingBounds.width) {
      cardWidth = this.subheadDrawing.x + subheadBounds.width;
    }
    cardWidth += GcpProductCard.spec.paddingLeft + GcpProductCard.spec.paddingRight;

    // card outline
    this.cardDrawing.graphics
      .clear()
      .beginFill(GcpProductCard.spec.background)
      .drawRoundRect(0, 0,
        cardWidth,
        cardHeight,
        GcpProductCard.spec.cornerRadius);
    this.cardDrawing.shadow = new createjs.Shadow(
      GcpProductCard.spec.shadow.color, 1, 2, 9);

    // setup container
    this.container.addChild(
      this.cardDrawing,
      this.iconDrawing,
      this.headingDrawing,
      this.subheadDrawing,
    );

    // explicitly set container width & height
    this.container.setBounds(0, 0, cardWidth, cardHeight);

    return this.container;
  }
}
