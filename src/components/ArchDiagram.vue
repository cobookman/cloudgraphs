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
    diagramData(newValue, oldValue) {
      // TODO(bookman): update drawing vs re-draw
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
    // change framerate to 60fps
    createjs.Ticker.framerate = 60;
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
      console.log('drawing');
      // clear old drawing
      this.stage.removeAllChildren();

      this.canvasRoot = new CanvasRoot(this.diagramData.elms);
      this.canvasRoot.on('pressmove', this.onPressMove.bind(this));
      this.canvasRoot.on('pressup', this.onPressUp.bind(this));

      this.stage.addChild(this.canvasRoot.render());
      this.scaleStage();
    },
    scaleStage() {
      this.stage.x = 0;
      this.stage.y = 0;
      this.stage.scaleX = this.scale;
      this.stage.scaleY = this.scale;
      // (0, 0, this.scale, this.scale);
      // const width = bounds.width + (this.padding * 2);
      // const height = bounds.height + (this.padding * 2);
      this.stage.canvas.width = this.width;
      this.stage.canvas.height = this.height;
    },
    onPressMove(evt, drawing) {
      if (!this.moving) {
        // first press, get coordinates
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
      this.diagramData.elms = this.canvasRoot.toJSON();
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
