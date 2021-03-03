import go from 'gojs';
import { objectMerge, str2Obj } from '@/utils/index';
import { ZoomSlider } from './zoom';

const goMake = go.GraphObject.make;

const PORT_GRAVITY = 20;
const FONT =
  '10pt Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';

const getLine = (direction, opts = {}) => {
  return goMake(
    go.Shape,
    direction,
    objectMerge(
      {
        stroke: 'lightgray',
        strokeWidth: 0.5
      },
      opts
    )
  );
};

const createDiagram = (container, opts) => {
  return goMake(go.Diagram, container, {
    grid: goMake(
      go.Panel,
      'Grid',
      getLine('LineH'),
      getLine('LineH', { interval: 10 }),
      getLine('LineV'),
      getLine('LineV', { interval: 10 })
    ),
    'draggingTool.dragsLink': true,
    'draggingTool.isGridSnapEnabled': true,
    'linkingTool.isUnconnectedLinkValid': true,
    'linkingTool.portGravity': PORT_GRAVITY,
    'relinkingTool.isUnconnectedLinkValid': true,
    'relinkingTool.portGravity': PORT_GRAVITY,
    'relinkingTool.fromHandleArchetype': goMake(go.Shape, 'Diamond', {
      segmentIndex: 0,
      cursor: 'pointer',
      desiredSize: new go.Size(8, 8),
      fill: 'tomato',
      stroke: 'darkred'
    }),
    'relinkingTool.toHandleArchetype': goMake(go.Shape, 'Diamond', {
      segmentIndex: -1,
      cursor: 'pointer',
      desiredSize: new go.Size(8, 8),
      fill: 'darkred',
      stroke: 'tomato'
    }),
    'linkReshapingTool.handleArchetype': goMake(go.Shape, 'Diamond', {
      desiredSize: new go.Size(7, 7),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    'rotatingTool.handleAngle': 270,
    'rotatingTool.handleDistance': 30,
    'rotatingTool.snapAngleMultiple': 15,
    'rotatingTool.snapAngleEpsilon': 15,
    'undoManager.isEnabled': true,
    ...opts
  });
};

const makePort = (name, spot, output, input) => {
  return goMake(go.Shape, 'Circle', {
    fill: null,
    stroke: null,
    desiredSize: new go.Size(7, 7),
    alignment: spot,
    alignmentFocus: spot,
    portId: name,
    fromSpot: spot,
    toSpot: spot,
    fromLinkable: output,
    toLinkable: input,
    cursor: 'pointer'
  });
};

const getSelectionAdornment = () => {
  return goMake(
    go.Adornment,
    'Auto',
    goMake(go.Shape, {
      fill: null,
      stroke: 'deepskyblue',
      strokeWidth: 1.5,
      strokeDashArray: [4, 2]
    }),
    goMake(go.Placeholder)
  );
};

const getResizePos = (alignment, cursor) => {
  return goMake(go.Shape, {
    alignment,
    cursor,
    desiredSize: new go.Size(6, 6),
    fill: 'lightblue',
    stroke: 'deepskyblue'
  });
};

const getResizeAdornment = () => {
  return goMake(
    go.Adornment,
    'Spot',
    { locationSpot: go.Spot.Right },
    goMake(go.Placeholder),
    getResizePos(go.Spot.TopLeft, 'nw-resize'),
    getResizePos(go.Spot.Top, 'n-resize'),
    getResizePos(go.Spot.TopRight, 'ne-resize'),
    getResizePos(go.Spot.Left, 'w-resize'),
    getResizePos(go.Spot.Right, 'e-resize'),
    getResizePos(go.Spot.BottomLeft, 'se-resize'),
    getResizePos(go.Spot.Bottom, 's-resize'),
    getResizePos(go.Spot.BottomRight, 'sw-resize')
  );
};

const getLinkSelectionAdornment = () => {
  return goMake(
    go.Adornment,
    'Link',
    goMake(go.Shape, {
      isPanelMain: true,
      fill: null,
      stroke: 'deepskyblue',
      strokeWidth: 0
    })
  );
};

const getRotateAdornment = () => {
  return goMake(
    go.Adornment,
    { locationSpot: go.Spot.Center, locationObjectName: 'CIRCLE' },
    goMake(go.Shape, 'Circle', {
      name: 'CIRCLE',
      cursor: 'pointer',
      desiredSize: new go.Size(7, 7),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    goMake(go.Shape, {
      geometryString: 'M3.5 7 L3.5 30',
      isGeometryPositioned: true,
      stroke: 'deepskyblue',
      strokeWidth: 1.5,
      strokeDashArray: [4, 2]
    })
  );
};

const showSmallPorts = (node, show) => {
  node.ports.each(function(port) {
    if (port.portId !== '') {
      port.fill = show ? 'rgba(0,0,0,.3)' : null;
    }
  });
};

const createNodeTemplate = () => {
  return goMake(
    go.Node,
    'Spot',
    { locationSpot: go.Spot.Center },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    {
      selectable: true,
      selectionAdornmentTemplate: getSelectionAdornment()
    },
    {
      resizable: true,
      resizeObjectName: 'PANEL',
      resizeAdornmentTemplate: getResizeAdornment()
    },
    { rotatable: true, rotateAdornmentTemplate: getRotateAdornment() },
    new go.Binding('angle').makeTwoWay(),
    goMake(
      go.Panel,
      'Auto',
      { name: 'PANEL' },
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
        go.Size.stringify
      ),
      goMake(
        go.Shape,
        'Rectangle',
        {
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          cursor: 'pointer',
          fill: 'white',
          strokeWidth: 1
        },
        new go.Binding('figure'),
        new go.Binding('fill'),
        new go.Binding('stroke')
      ),
      goMake(
        go.TextBlock,
        {
          font: FONT,
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true
        },
        new go.Binding('text').makeTwoWay()
      )
    ),
    makePort('T', go.Spot.Top, false, true),
    makePort('L', go.Spot.Left, true, true),
    makePort('R', go.Spot.Right, true, true),
    makePort('B', go.Spot.Bottom, true, false),
    {
      mouseEnter: function(e, node) {
        showSmallPorts(node, true);
      },
      mouseLeave: function(e, node) {
        showSmallPorts(node, false);
      }
    }
  );
};

const createLinkTemplate = () => {
  return goMake(
    go.Link,
    {
      selectable: true,
      selectionAdornmentTemplate: getLinkSelectionAdornment()
    },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4
    },
    new go.Binding('points').makeTwoWay(),
    goMake(go.Shape, { isPanelMain: true, strokeWidth: 2 }),
    goMake(go.Shape, { toArrow: 'Standard', stroke: null }),
    goMake(
      go.Panel,
      'Auto',
      new go.Binding('visible', 'isSelected').ofObject(),
      goMake(go.Shape, 'RoundedRectangle', { fill: '#F8F8F8', stroke: null }),
      goMake(
        go.TextBlock,
        {
          font: FONT,
          textAlign: 'center',
          stroke: '#333333',
          margin: 1,
          minSize: new go.Size(10, NaN),
          editable: true
        },
        new go.Binding('text').makeTwoWay()
      )
    )
  );
};

export const initDiagram = (container, opts = {}) => {
  const myDiagram = createDiagram(container, opts);
  myDiagram.nodeTemplate = createNodeTemplate();
  myDiagram.linkTemplate = createLinkTemplate();
  return myDiagram;
};

export const initPalette = (myDiagram, container) => {
  const myPalette = goMake(go.Palette, container, {
    maxSelectionCount: 1,
    nodeTemplateMap: myDiagram.nodeTemplateMap,
    linkTemplate: goMake(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: goMake(
          go.Adornment,
          'Link',
          { locationSpot: go.Spot.Center },
          goMake(go.Shape, {
            isPanelMain: true,
            fill: null,
            stroke: 'deepskyblue',
            strokeWidth: 0
          }),
          goMake(go.Shape, { toArrow: 'Standard', stroke: null })
        )
      },
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4
      },
      new go.Binding('points'),
      goMake(go.Shape, { isPanelMain: true, strokeWidth: 1 }),
      goMake(go.Shape, { toArrow: 'Standard', stroke: null })
    ),
    model: new go.GraphLinksModel([
      // { text: 'xxxx', figure: 'Circle', fill: 'white' },
      { text: '圆形', figure: 'Circle', fill: 'white' },
      { text: '圆角', figure: 'RoundedRectangle', fill: 'white' },
      { text: '矩形', figure: 'Rectangle', fill: 'white' },
      {
        text: '文本',
        figure: 'Rectangle',
        fill: 'white',
        stroke: 'transparent'
      },
      { text: '菱形', figure: 'Diamond', fill: 'white' }
    ])
  });
  return myPalette;
};

export const getDiagramData = myDiagram => {
  saveDiagramProperties(myDiagram);
  return str2Obj(myDiagram.model.toJson());
};

function saveDiagramProperties(myDiagram) {
  myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
}
function loadDiagramProperties(myDiagram, e) {
  var pos = myDiagram.model.modelData.position;
  if (pos) myDiagram.initialPosition = go.Point.parse(pos);
}

export const updateDiagram = (myDiagram, v) => {
  myDiagram.model = go.Model.fromJson(v);
  loadDiagramProperties(myDiagram);
};

export const createZoomSlider = myDiagram => {
  new ZoomSlider(myDiagram, {
    alignment: go.Spot.BottomRight,
    alignmentFocus: go.Spot.BottomRight,
    orientation: 'vertical'
  });
};
