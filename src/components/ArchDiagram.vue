<template>
  <canvas id="arch-diagram-canvas"></canvas>
</template>

<script>
import createjs from 'createjs-cmd';
import GcpProductCard from '@/components/diagramming/GcpProductCard';

export default {
  name: 'ArchDiagram',
  data() {
    return {
    };
  },

  mounted() {
    this.stage = new createjs.Stage('arch-diagram-canvas');
    const gae = new GcpProductCard({
      product: GcpProductCard.products.GAE,
      title: 'Frontend Service',
      x: 0,
      y: 0,
    });
    gae.draw(this.stage);
  },
};
</script>

<style scoped>
canvas {
background: black;
}
</style>
