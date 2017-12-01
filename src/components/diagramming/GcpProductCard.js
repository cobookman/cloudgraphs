import createjs from 'createjs-cmd';
import products from '@/components/diagramming/products';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';

export default class GcpProductCard extends AbstractDrawing {
  // make it so products is static const
  static get products() {
    return products;
  }

  constructor(params) {
    super();
    this.id = params.id;
    this.productAcronym = params.productAcronym;
    this.product = GcpProductCard.products[this.productAcronym.toUpperCase()];
    this.title = params.title;
    this.byline = params.byline || this.product.name;
    this.x = params.x || 0;
    this.y = params.y || 0;

    this.cardDrawing = new createjs.Shape();
    this.iconDrawing = new createjs.Bitmap();
    this.titleDrawing = new createjs.Text();
    this.bylineDrawing = new createjs.Text();

    this.container = new createjs.Container();
    this.container.setBounds(0, 0, 0, 0);
  }

  toJSON() {
    return {
      id: this.id,
      type: 'GcpProductCard',
      productAcronym: this.productAcronym,
      title: this.title,
      byline: this.byline,
      x: this.x,
      y: this.y,
    };
  }

  render() {
    this.container.removeAllChildren();

    // card outline
    this.cardDrawing.graphics
      .clear()
      .beginFill('#FFF')
      .drawRoundRect(0, 0, 530, 170, 2);
    this.cardDrawing.shadow = new createjs.Shadow('#777', 1, 2, 9);

    // icon
    const image = document.createElement('img');
    image.src = this.product.icon;
    this.iconDrawing.image = image;
    this.iconDrawing.x = 20;
    this.iconDrawing.y = 30 - 8;

    // title
    this.titleDrawing.text = this.title;
    this.titleDrawing.color = '#212121';
    this.titleDrawing.font = '37px Roboto';
    this.titleDrawing.x = 190;
    this.titleDrawing.y = 35;

    // byline
    this.bylineDrawing.text = this.byline;
    this.bylineDrawing.color = '#757575';
    this.bylineDrawing.font = '35px Roboto';
    this.bylineDrawing.x = 190;
    this.bylineDrawing.y = 90;

    // container
    this.container.x = this.x;
    this.container.y = this.y;
    this.container.addChild(
      this.cardDrawing,
      this.iconDrawing,
      this.titleDrawing,
      this.bylineDrawing,
    );

    // eplicitly set container width & height
    const bounds = this.container.getBounds();
    this.container.setBounds(bounds.x, bounds.y, 530, 170);

    // container.on('pressmove', this.onPressMove.bind(this));
    // container.on('pressup', this.onPressUp.bind(this));
    return this.container;
  }

  // onPressMove(evt) {
  //   if (!this.moving) {
  //     this.moving = true;
  //     this.movingOffsetX = this.container.x - evt.stageX;
  //     this.movingOffsetY = this.container.y - evt.stageY;
  //   }
  //
  //   // todo(bookman): calculate where you are on card & offset so less janky
  //   this.container.x = evt.stageX + this.movingOffsetX;
  //   this.container.y = evt.stageY + this.movingOffsetY;
  //   this.x = this.container.x;
  //   this.y = this.container.y;
  //   this.stage.update();
  //   (this.onMoveHandlers || []).forEach((handler) => {
  //     handler();
  //   });
  // }
  //
  // onPressUp() {
  //   this.moving = false;
  // }
}
