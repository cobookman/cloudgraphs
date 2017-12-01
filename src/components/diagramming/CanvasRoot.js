import createjs from 'createjs-cmd';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';
import GcpProductCard from '@/components/diagramming/GcpProductCard';
import GcpProductZone from '@/components/diagramming/GcpProductZone';

export default class CanvasRoot extends AbstractDrawing {
  constructor(elms) {
    super();
    this.elms = elms;
    this.container = new createjs.Container();
  }

  static drawingFactory(elm) {
    switch (elm.type) {
      case 'GcpProductCard':
        return new GcpProductCard(elm);
      case 'GcpProductZone':
        return new GcpProductZone(elm);
      default:
        throw new Error(`unknown diagram type: ${elm.type}`);
    }
  }

  renderElms() {
    const recurseTree = function recurseTree(elm) {
      // render current element in tree
      const drawing = CanvasRoot.drawingFactory(elm);

      // render its children
      if (elm.elms) {
        elm.elms.forEach((childElm) => {
          const childDrawing = recurseTree(childElm);
          drawing.addChild(childDrawing);
        });
      }

      return drawing;
    };

    this.renderings = this.elms.map(elm => recurseTree(elm, this.renderings));
  }

  recurseTree(elm) {
    const drawing = CanvasRoot.drawingFactory(elm);

    // handle child elms
    if (elm.elms) {
      elm.elms.forEach((childElm) => {
        const childDrawing = this.recurseTree(childElm, drawing);
        drawing.addChild(childDrawing);
      });
    }

    return drawing;
  }

  // renders the drawings & attaches necessary event hooks
  render() {
    // clear canvas
    this.container.removeAllChildren();
    this.container.x = 0;
    this.container.y = 0;

    this.drawings = [];
    this.elms.forEach((elm) => {
      const elmDrawing = this.recurseTree(elm);
      this.container.addChild(elmDrawing.render());
      this.drawings.push(elmDrawing);
    });
    // render the tree to container
    //
    // const drawings = this.elms.map((elm) => {
    //   // get the class of the element being rendered
    //   const drawing = CanvasRoot.drawingFactory(elm);
    //
    //   // attach onDrawingMove callback w/past raw drawing data
    //   // drawing.on('move', this.onDrawingMove.bind(this, elm));
    //
    //   return drawing;
    // });
    //
    // // create a container to wrap drwaings
    // const container = new createjs.Container();
    // container.x = 0;
    // container.y = 0;

    // drawings.forEach((drawing) => {
    //   container.addChild(drawing.render());
    // });

    return this.container;
  }

  // clears the canvas of all drawings
  clear(stage) {
    if (this.container) {
      stage.removeChild(this.container);
    }
  }

  // handle movement of underlying drawings
  onDrawingMove(elmI, movedDrawing) {
    const newElms = Object.assign({}, this.elms);
    newElms[elmI] = movedDrawing;
    this.emit('move', newElms);
  }
}
