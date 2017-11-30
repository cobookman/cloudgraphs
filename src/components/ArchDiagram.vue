<template>
  <canvas id="arch-diagram-canvas"></canvas>
</template>

<script>
import createjs from 'createjs-cmd';
import GcpProductCard from '@/components/diagramming/GcpProductCard';

export default {
  name: 'ArchDiagram',
  props: ['scale', 'products'],
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
  },
  mounted() {
    this.stage = new createjs.Stage('arch-diagram-canvas');
    createjs.Touch.enable(this.stage, true, false);

    // update async events when ready (aka images)
    createjs.Ticker.on('tick', this.stage);
    this.draw();
  },
  methods: {
    draw() {
      this.clear();
      this.products.forEach((product) => {
        const card = new GcpProductCard(product, this.scale);
        card.draw(this.stage);
        this.cards.push(card);
      });
    },
    clear() {
      this.cards.forEach(card => card.delete(this.stage));
      this.cards = [];
    },
  },
};
</script>

<style scoped>
canvas {
background: #fff;
}
</style>
