<template>
  <div>
    <canvas id="arch-diagram-canvas"></canvas>
  </div>
</template>

<script>
import createjs from 'createjs-cmd';
// import GcpProductCard from '@/components/diagramming/GcpProductCard';
// import GcpProductZone from '@/components/diagramming/GcpProductZone';
import CanvasRoot from '@/components/diagramming/CanvasRoot';

export default {
  name: 'ArchDiagram',
  props: {
    scale: {
      default: 1.0,
      type: Number,
    },
    diagramData: {
      default: {},
      type: Object,
    },
    padding: {
      default: 20,
      type: Number,
    },
  },
  data() {
    return {
      drawings: {},
    };
  },
  watch: {
    scale() {
      this.scaleStage();
    },
    diagramData(newValue, oldValue) {
      // TODO(bookman): update drawing vs re-draw
      this.draw();
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
      // clear old drawing
      this.stage.removeAllChildren();
      this.stage.update();
      this.canvasRoot = new CanvasRoot(this.diagramData.elms);
      const container = this.canvasRoot.render();
      this.stage.addChild(container);
      this.scaleStage();
    },
    scaleStage() {
      this.stage.setTransform(0, 0, this.scale, this.scale);
      const bounds = this.stage.getBounds();
      const width = bounds.width + (this.padding * 2);
      const height = bounds.height + (this.padding * 2);
      this.stage.canvas.width = width * this.scale;
      this.stage.canvas.height = height * this.scale;
    },
    onElmMove(card) {
      this.$emit('onElmMove', card);
    },
  },
};
</script>

<style scoped>
canvas {
  background: #fff;
  display: inline-block;
  border: 1px solid #aaa;
}
div {
  display: inline-block;
}
</style>
