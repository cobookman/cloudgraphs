<template>
  <div>
    <canvas id="arch-diagram-canvas"></canvas>
  </div>
</template>

<script>
import createjs from 'createjs-cmd';
import GcpProductCard from '@/components/diagramming/GcpProductCard';

export default {
  name: 'ArchDiagram',
  props: ['scale', 'products', 'width', 'height'],
  data() {
    return {
      cards: [],
    };
  },
  watch: {
    scale() {
      this.cards.forEach(card => card.scale(this.scale));
    },
    products() {
      this.draw();
    },
    width() {
      this.stage.canvas.width = this.width;
      this.stage.update();
    },
    height() {
      this.stage.canvas.height = this.height;
      this.stage.update();
    },
  },
  mounted() {
    // change framerate to 30fps
    createjs.Ticker.framerate = 30;
    this.stage = new createjs.Stage('arch-diagram-canvas');
    this.stage.canvas.height = this.height;
    this.stage.canvas.width = this.width;
    createjs.Touch.enable(this.stage, true, false);

    // update async events when ready (aka images)
    createjs.Ticker.on('tick', this.stage);
    this.draw();
  },
  methods: {
    draw() {
      this.clear();
      this.products.forEach((product) => {
        const card = new GcpProductCard(product, this.stage, this.scale);
        card.draw();
        card.on('move', this.onCardMove.bind(this, card));
        this.cards.push(card);
      });
    },
    clear() {
      this.cards.forEach(card => card.delete(this.stage));
      this.cards = [];
    },
    onCardMove(card) {
      this.$emit('cardMove', card);
    },
  },
};
</script>

<style scoped>
canvas {
  background: #fff;
  display: inline-block;
}
div {
  display: inline-block;
}
</style>
