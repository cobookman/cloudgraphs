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
    }
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
      console.log('drawing');
      // clear old drawing
      this.stage.removeAllChildren();
      this.stage.update();
      this.canvasRoot = new CanvasRoot(this.diagramData.elms);
      this.canvasRoot.on('pressmove', this.onPressMove.bind(this));
      this.canvasRoot.on('pressup', this.onPressUp.bind(this));

      this.canvasRoot.on('pressup', (evt, drawing) => {
        console.log('pressup', evt, drawing);
      });

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
      if (!drawing.moving) {
        // first press, get coordinates
        drawing.moving = true;
        drawing.deltaX = drawing.x - (evt.stageX / this.scale);
        drawing.deltaY = drawing.y - (evt.stageY / this.scale);
      } else {
        // console.log('drawing', drawing);
        drawing.x = drawing.deltaX + (evt.stageX / this.scale);
        drawing.y = drawing.deltaY + (evt.stageY / this.scale);
        // this.diagramData.elms = this.canvasRoot.toJSON();
        // console.log(this.canvasRoot.toJSON());
      }
    },
    onPressUp(evt, drawing) {
      this.diagramData.elms = this.canvasRoot.toJSON();
      this.draw();
      // // (drawing, evt) => {
      //
      //   // console.log(drawing, evt);
      //   // onPressMove(drawing, evt) {
      //   //   console.log(evt);
      //   //   if (!drawing.isMoving) {
      //   //     drawing.originalX = drawing.x;
      //   //     drawing.originalY = drawing.y;
      //   //     drawing.deltaX = drawing.x - evt.stageX;
      //   //     drawing.deltaY = drawing.y - evt.stageY;
      //   //     drawing.isMoving = true;
      //   //   } else {
      //   //     drawing.x = drawing.deltaX + evt.stageX;
      //   //     drawing.y = drawing.deltaY + evt.stageY;
      //   //     drawing.render();
      //   //   }
      //   // }
      // });

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
