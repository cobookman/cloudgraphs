<template>
  <div>
    <canvas id="arch-diagram-canvas"></canvas>
  </div>
</template>

<script>
import createjs from 'createjs-cmd';
// import GcpProductCard from '@/components/diagramming/GcpProductCard';
// import GcpProductGrouping from '@/components/diagramming/GcpProductGrouping';
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
    width: {
      default: 800,
      type: Number,
    },
    height: {
      default: 600,
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
      this.draw();
    },
    diagramData() {
      this.draw();
    },
    width() {
      this.draw();
    },
    height() {
      this.draw();
    },
  },
  mounted() {
    this.stage = new createjs.Stage('arch-diagram-canvas');
    this.stage.canvas.height = this.height;
    this.stage.canvas.width = this.width;

    createjs.Touch.enable(this.stage, true, false);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on('tick', this.stage);

    this.draw();
  },
  methods: {
    draw() {
      // clear old drawing
      this.stage.removeAllChildren();
      this.canvasRoot = new CanvasRoot(this.diagramData);
      this.canvasRoot.on('pressmove', this.onPressMove.bind(this));
      this.canvasRoot.on('pressup', this.onPressUp.bind(this));

      this.stage.addChild(this.canvasRoot.render());
      this.scaleStage();

      // force update to avoid flicker
      this.stage.update();
    },
    scaleStage() {
      this.stage.x = 0;
      this.stage.y = 0;
      this.stage.scaleX = this.scale;
      this.stage.scaleY = this.scale;
      this.stage.canvas.width = this.width;
      this.stage.canvas.height = this.height;
    },
    onPressMove(evt, drawing) {
      if (!this.moving) {
        this.moving = true;
        this.deltaX = drawing.x - (evt.stageX / this.scale);
        this.deltaY = drawing.y - (evt.stageY / this.scale);
      } else {
        const x = this.deltaX + (evt.stageX / this.scale);
        const y = this.deltaY + (evt.stageY / this.scale);
        drawing.setXY(x, y);
      }
    },
    onPressUp() {
      this.moving = false;
      this.$emit('diagramDataChange', this.canvasRoot.toJSON());
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
