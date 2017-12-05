import createjs from 'createjs-cmd';
import AbstractDrawing from '@/components/diagramming/AbstractDrawing';
import GcpArrow from '@/components/diagramming/GcpArrow';
import GcpProductCard from '@/components/diagramming/GcpProductCard';
import GcpProductGrouping from '@/components/diagramming/GcpProductGrouping';

export default class CanvasRoot extends AbstractDrawing {
  constructor(diagramData) {
    super();
    this.diagramData = diagramData;
    this.container = new createjs.Container();
    this.drawings = { elms: [], arrows: [] };
  }

  static drawingFactory(elm) {
    switch (elm.type) {
      case 'GcpProductCard':
        return new GcpProductCard(elm);
      case 'GcpProductGrouping':
        return new GcpProductGrouping(elm);
      default:
        throw new Error(`unknown diagram type: ${elm.type}`);
    }
  }

  toJSON() {
    return {
      elms: (this.drawings.elms || []).map(drawing => drawing.toJSON()),
      arrows: (this.drawings.arrows || []).map(drawing => drawing.toJSON()),
    };
  }

  recurseElmTree(elm) {
    const drawing = CanvasRoot.drawingFactory(elm);
    drawing.on('pressmove', (evt) => {
      this.emit('pressmove', evt, drawing);
    });
    drawing.on('pressup', (evt) => {
      this.emit('pressup', evt, drawing);
    });

    // handle child elms
    if (elm.elms) {
      elm.elms.forEach((childElm) => {
        const childDrawing = this.recurseElmTree(childElm, drawing);
        drawing.addChild(childDrawing);
      });
    }

    return drawing;
  }

  // renders the drawings & attaches necessary event hooks
  render() {
    this.clear();
    this.container.x = 0;
    this.container.y = 0;

    const elmDrawingsById = {};
    this.drawings = {
      elms: (this.diagramData.elms || []).map((elm) => {
        const drawing = this.recurseElmTree(elm);
        this.container.addChild(drawing.render());
        elmDrawingsById[elm.id] = drawing;
        return drawing;
      }),
      arrows: (this.diagramData.arrows || []).map((arrow) => {
        const drawing = new GcpArrow(Object.assign({
          fromDrawing: elmDrawingsById[arrow.from],
          toDrawing: elmDrawingsById[arrow.to],
        }, arrow));
        this.container.addChild(drawing.render());
        return drawing;
      }),
    };

    return this.container;
  }

  // clears the canvas of all drawings
  clear() {
    if (this.container) {
      this.container.removeAllChildren();
    }
  }

  // handle movement of underlying drawings
  onDrawingMove(elmI, movedDrawing) {
    const newElms = Object.assign({}, this.elms);
    newElms[elmI] = movedDrawing;
    this.emit('move', newElms);
  }
}
