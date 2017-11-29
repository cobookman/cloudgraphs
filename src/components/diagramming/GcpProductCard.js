import createjs from 'createjs-cmd';

// List of GCP Products with card info
const products = Object.freeze({
  GAE: Object.freeze({
    icon: 'icons/gcp/Compute/App Engine.svg',
    name: 'App Engine',
  }),
  GCE: Object.freeze({
    icon: 'icons/gcp/Compute/Compute Engine.svg',
    name: 'Compute Engine',
  }),
});

export default class GcpProductCard {
  // make it so products is static const
  static get products() {
    return products;
  }

  constructor(params) {
    this.product = params.product;
    this.title = params.title;
    this.byline = params.byline || null;
    this.x = params.x || null;
    this.y = params.y || null;
    this.scale = params.scale || 1.0;
  }

  genCard() {
    const card = new createjs.Shape();
    card.graphics.beginFill('#fff').drawRect(0, 0, 150, 70);
    card.x = this.x;
    card.y = this.y;
    return card;
  }

  draw(stage) {
    this.delete(stage);

    // generate card outline
    this.card = this.genCard();
    stage.addChild(this.card);


    // update canvas
    stage.update();
  }

  delete(stage) {
    if (this.card) {
      stage.removeChild(this.card);
    }
  }
}
