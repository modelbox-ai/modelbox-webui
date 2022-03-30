/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { select as d3_select } from 'd3-selection';
import { selectAll as d3_selectAll } from 'd3-selection';
import { transition as d3_transition } from 'd3-transition';
import { zoomIdentity as d3_zoomIdentity } from 'd3-zoom';
import { zoomTransform as d3_zoomTransform } from 'd3-zoom';
import { event as d3_event } from 'd3-selection';
import { mouse as d3_mouse } from 'd3-selection';
import 'd3-graphviz';
import { DialogService } from 'ng-devui/modal';
import { wasmFolder } from '@hpcc-js/wasm';
import DotGraph from './dot';
import { DataServiceService } from '@shared/services/data-service.service';
import { I18nService } from '@core/i18n.service';
import { ToastService } from 'ng-devui/toast';
import { BasicServiceService } from '@shared/services/basic-service.service';

const shapes = 'box polygon ellipse oval circle point egg triangle plaintext plain diamond trapezium parallelogram house pentagon hexagon septagon octagon doublecircle doubleoctagon tripleoctagon invtriangle invtrapezium invhouse Mdiamond Msquare Mcircle rect rectangle square star none underline cylinder note tab folder box3d component promoter cds terminator utr primersite restrictionsite fivepoverhang threepoverhang noverhang assembly signature insulator ribosite rnastab proteasesite proteinstab rpromoter rarrow larrow lpromoter'.split(
  ' '
);

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.less'],
})
export class GraphComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvas: ElementRef;

  @Input() disabled: any;
  @Input() fit: any;
  @Input() engine: any;
  @Input() dotSrc: '';
  @Input() onInitialized: any;
  @Input() registerGetSvg: any;
  @Input() onFocus: any;
  @Input() onSelect: any;
  @Input() onTextChange: any;
  @Input() hasFocus: boolean;
  @Input() defaultEdgeAttributes: any;
  @Input() onUndo: any;
  @Input() onRedo: any;
  @Input() onHelp: any;
  @Input() onError: any;
  @Input() tweenPaths: any;
  @Input() tweenShapes: any;
  @Input() tweenPrecision: any;
  @Input() test: any;
  @Input() registerNodeShapeClick: any;
  @Input() registerNodeShapeDragStart: any;
  @Input() registerNodeShapeDragEnd: any;
  @Input() registerZoomInButtonClick: any;
  @Input() registerZoomOutButtonClick: any;
  @Input() registerZoomFitButtonClick: any;
  @Input() registerZoomResetButtonClick: any;
  @Input() registerNodeAttributeChange: any;
  @Input() registerExtendDetail: any;
  @Input() isResizing: any;

  prevFit: any;
  prevEngine: any;
  prevDotSrc = '';
  latestEdgeAttributes: any = {};
  edgeIndex: number;
  startNode: any;
  isDrawingEdge: boolean;
  isOnFocus: boolean;
  selectedComponents: any = d3_selectAll(null);
  selectNames: any;
  selectRects: any = d3_select(null);
  latestInsertedNodeData: any;
  drawnNodeName = null;
  busy = false;
  // d3 canvas div
  div: any;
  graphviz: any;
  graph0: any;
  dotGraph: any;
  prelDotGraph: any;
  originalViewBox: any;
  state: any;
  rendering = false;
  canMoveGraph = false;
  pendingUpdate = false;
  renderGraphReady = false;
  transitionDuration = 0.6;
  latestNodeAttributes: any = {};
  nodeIndex: any = null;
  selectArea: any;
  defaultNodeAttributes: any = {};
  svg = d3_select(null);
  startPoints: any = [];
  endPoints: any = [];
  pointCr: any = 6;
  maxHeight: any = 150;
  extended: any = false;
  msgs: Array<Object> = [];
  nodeBbox: any;


  constructor(
    private dataService: DataServiceService,
    private i18n: I18nService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private basicService: BasicServiceService) {
    this.toastService.open({
      value: [{ severity: 'info', content: this.i18n.getById('graph.cavans.tip') }],
      life: 1500
    });
  }

  ngAfterViewInit(): void {
    this.div = d3_select(this.canvas.nativeElement);
    this.createGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { dotSrc } = changes;
    if (dotSrc && !dotSrc.firstChange) {
      this.renderGraph();
    }
  }

  createGraph() {
    wasmFolder('lib/@hpcc-js/wasm/dist');
    this.graphviz = this.div
      .graphviz()
      .onerror(this.handleError.bind(this))
      .on('initEnd', () => this.renderGraph());
    this.registerGetSvg(this.getSvg, this);
    this.registerZoomInButtonClick(this.handleZoomInButtonClick, this);
    this.registerZoomOutButtonClick(this.handleZoomOutButtonClick, this);
    this.registerZoomFitButtonClick(this.handleZoomFitButtonClick, this);
    this.registerZoomResetButtonClick(this.handleZoomResetButtonClick, this);
    this.registerNodeShapeClick(this.handleNodeShapeClick, this);
    this.registerNodeAttributeChange(this.handleNodeAttributeChange, this);
    if (this.dataService.currentPage === "main") {
      //no need in solutiuon pgae
      this.registerNodeShapeDragStart(this.handleNodeShapeDragStart, this);
      this.registerNodeShapeDragEnd(this.handleNodeShapeDragEnd, this);
    }
  }

  replaceEdgeLinkName(linkName, nodeName, newNodeName): string {
    if (linkName.indexOf(':') > 0) {
      return linkName.replace(
        new RegExp('^' + nodeName + ':'),
        newNodeName + ':'
      );
    } else {
      return linkName.replace(new RegExp('^' + nodeName), newNodeName);
    }
  }

  handleNodeAttributeChange = config => {
    const attributes: any = {};
    const edges = [];
    const nodeName = config.name;
    const newName = config.newName;
    for (let edge in this.dotGraph.edges) {
      const edgeArr = edge.split('->');
      const isRelatedEdge = edgeArr.some(item => {
        return item.split(':').indexOf(nodeName) === 0;
      });
      if (isRelatedEdge) {
        edges.push({
          from: this.replaceEdgeLinkName(edgeArr[0], nodeName, newName),
          to: this.replaceEdgeLinkName(edgeArr[1], nodeName, newName),
        });
      }
    }
    config.attributes.forEach(item => {
      attributes[item.key] = item.value;
    });
    // delete original node
    this.dotGraph.updateNode(nodeName, attributes, newName);
    this.dotGraph.reparse();
    this.formatDotSrc();
    setTimeout(() => {
      this.onTextChange(this.dotGraph.dotSrc);
    }, 100)
  };

  formatDotSrc(): void {
    if (this.dotGraph !== undefined) {
      const nodes = { ...this.dotGraph.nodes };
      const edges = { ...this.dotGraph.edges };
      for (let node in nodes) {
        let attr = nodes[node]['attributes'];
        let flowunit = attr['flowunit'];
        let device = attr['device'];
        if (flowunit) {
          attr["label"] = this.dataService.getLabel(flowunit, device, node);
          if (attr["label"] == "") {
            attr["label"] = this.getLabelFromEdge(node, edges);
          }
        }
        this.dotGraph.updateNode(node, attr);
        this.dotGraph.reparse();
      }
    }
  }

  handleZoomResetButtonClick = () => {
    try {
      this.setZoomScale(1, true);
    } catch (e) {
      location.reload();
    }
  };

  handleZoomFitButtonClick = () => {
    try {
      const viewBox = this.svg.attr('viewBox').split(' ');
      const bbox = this.graph0.node().getBBox();
      const xRatio = viewBox[2] / bbox.width;
      const yRatio = viewBox[3] / bbox.height;
      const scale = Math.min(xRatio, yRatio);
      this.setZoomScale(scale, true);
    }
    catch (e) {
      location.reload();
    }
  };

  handleZoomOutButtonClick = () => {
    let scale = d3_zoomTransform(this.graphviz.zoomSelection().node()).k;
    scale = scale / 1.01;
    this.setZoomScale(scale);
  };

  handleZoomInButtonClick = () => {
    let scale = d3_zoomTransform(this.graphviz.zoomSelection().node()).k;
    scale = scale * 1.01;
    this.setZoomScale(scale);
  };

  handleNodeShapeDragOver = event => {
    event.preventDefault();
  };

  handleNodeShapeDragStart = (event, data) => {
    if (this.busy) return;
    const newData: any = this.formAttribute(data);
    if (newData.shape === '(default)') {
      newData.shape = null;
    }
    let outsideOfViewPort = 1000000;
    this.latestInsertedNodeData = newData;
    this.drawNodeWithDefaultAttributes(
      outsideOfViewPort,
      outsideOfViewPort,
      newData
    );
    let node = this.graphviz.drawnNodeSelection();

    if (!node.empty() && navigator.userAgent.indexOf("Chrome") == -1) {
      let bbox = node.node().getBBox();
      let scale = node.node().getCTM().a;
      node.attr('transform', `scale(${scale})`);
      event.dataTransfer.setDragImage(
        node.node(),
        ((bbox.width / 2) * scale * 4) / 3,
        ((bbox.height / 2) * scale * 4) / 3
      );
    }
    event.dataTransfer.setData('text', JSON.stringify(newData));
  };

  handleNodeShapeDragEnd = (event, data) => {
    if (this.busy) return;
    this.graphviz.removeDrawnNode();
  };

  drawNodeWithDefaultAttributes(x0, y0, data = {}) {
    this.latestNodeAttributes = Object.assign({}, this.defaultNodeAttributes);
    Object.assign(this.latestNodeAttributes, data);
    this.drawnNodeName = this.getNextNodeId(data);
    this.drawNode(x0, y0, this.drawnNodeName, this.latestNodeAttributes);
  }

  handleNodeShapeDrop = event => {
    if (this.busy) return;
    if (!event.dataTransfer.getData('text')) return;
    this.onFocus();
    event.preventDefault();
    this.graphviz.drawnNodeSelection().attr('transform', null);
    const node = this.graph0.node();
    let point = this.svg.node().createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    const [x0, y0] = [point.x, point.y];
    this.updateAndInsertDrawnNode(x0, y0, {});
  };

  updateAndInsertDrawnNode(x0, y0, attributes) {
    const nodeName = this.drawnNodeName;
    attributes = Object.assign(this.latestNodeAttributes, attributes);
    if (attributes.label) {
      attributes.label = attributes.label.replace('_NODE_NAME_', nodeName);
    }
    this.graphviz.updateDrawnNode(x0, y0, nodeName, attributes);
    this.graphviz.insertDrawnNode(nodeName);
    this.dotGraph.insertNode(nodeName, attributes);
    this.dotGraph.reparse();
    this.formatDotSrc();
    this.onTextChange(this.dotGraph.dotSrc);
  }

  formAttribute(data) {
    return {
      type: 'flowunit',
      flowunit: data.name,
      device: data.type,
      deviceid: 0,
    };
  }

  handleNodeShapeClick = (event, data) => {
    if (this.busy) return;
    const newData: any = this.formAttribute(data);
    if (newData.shape === '(default)') {
      newData.shape = null;
    }
    this.onFocus();
    const x0 = null;
    const y0 = null;
    this.latestInsertedNodeData = newData;
    this.insertNodeWithDefaultAttributes(x0, y0, newData);
  };

  handleError(errorMessage) {
    const line = errorMessage.replace(/.*error in line ([0-9]*) .*\n/, '$1');
    if (this.onError !== undefined) {
      this.onError({ message: errorMessage, line: line });
    }
    this.rendering = false;
    this.busy = false;
    if (this.pendingUpdate) {
      this.pendingUpdate = false;
    }
  }

  renderGraph() {
    const container = this.div.node().parentElement.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const fit = this.fit;
    const engine = this.engine;
    if (this.dotSrc !== undefined && this.dotSrc.length === 0) {
      this.svg.remove();
      this.svg = d3_select(null);
      if (this.onError !== undefined) {
        this.onError(null);
      }
      this.renderGraphReady = false;
      this.prevDotSrc = this.dotSrc;
      return;
    }

    if (
      this.dotSrc === this.prevDotSrc &&
      this.engine === this.prevEngine &&
      this.fit === this.prevFit
    ) {
      return;
    }
    if (this.rendering) {
      this.pendingUpdate = true;
      return;
    }
    if (this.fit !== this.prevFit) {
      if (this.renderGraphReady) {
        if (this.prevFit) {
          this.unFitGraph();
          this.setZoomScale(1, true);
        } else {
          this.setZoomScale(1, false, true);
          this.fitGraph();
        }
      }
      this.prevFit = this.fit;
    }
    this.prevDotSrc = this.dotSrc;
    this.prevEngine = this.engine;
    try {
      if (!this.test?.disableDotParsing) {
        if (this.dotSrc !== undefined) {
          this.prelDotGraph = new DotGraph(this.dotSrc);
        }
      }
      if (this.onError !== undefined) {
        this.onError(null);
      }
    } catch (error) {
      if (!error.location) {
        throw error;
      }
      const {
        location: {
          start: { line },
        },
        message,
      } = error;
      if (this.onError !== undefined) {
        this.onError({ message: message, line: line });
      }
      return;
    }
    this.rendering = true;
    this.busy = true;
    this.graphviz
      .width(width)
      .height(height)
      .engine(engine)
      .growEnteringEdges(false)
      .fit(fit)
      .tweenPaths(this.tweenPaths)
      .tweenShapes(this.tweenShapes)
      .tweenPrecision(this.tweenPrecision)
      .attributer(function (d, a, b) {
        if (d.tag === 'svg') {
          b[0].style.backgroundColor = "#FAFAFA";
        }
        if (d.tag === 'polygon') {
          if (d.key === 'polygon-0') {
            b[0].style.backgroundColor = "#FAFAFA";
          } else {
            d.attributes.fill = "#ADB0B8";
            d.attributes.stroke = "#ADB0B8";
          }
        }
        if (d.tag === 'polyline') {
          d.attributes.stroke = "#ADB0B8";
        }
        if (d.tag === 'path') {
          if (
            !d.parent.key.includes('->') &&
            d.attributes.fill === 'none'
          ) {
            d.attributes.fill = 'white';
            d.attributes.stroke = '#ADB0B8';
          } else {
            d.attributes.stroke = '#ADB0B8';
          }
        }
        if (shapes.includes(d.tag) && d.attributes.fill === 'none') {
          d.attributes.fill = 'white';
          d.attributes.stroke = 'white';
        }
        if (d.tag === "text") {
          d.attributes["font-size"] = "12";
          if (d.children[0].text == d.parent.key) {
            d.attributes.fill = "#252B3A";
            d.attributes["font-weight"] = "600";
          } else {
            d.attributes.fill = "#8A8E99";
          }
        }
      })
      .dot(this.dotSrc, this.handleDotLayoutReady.bind(this))
      .on('renderEnd', this.handleRenderStaged.bind(this))
      .render(this.handleRenderGraphReady.bind(this));


    this.formatDotSrc();
  }

  handleDotLayoutReady() {
    let [, , width, height] = this.graphviz
      .data()
      .attributes.viewBox.split(' ');
    this.originalViewBox = { width, height };
  }

  handleRenderStaged() {
    if (this.renderGraphReady) {
      this.markSelectedComponents(this.selectedComponents);
    }
    this.isDrawingEdge = false;
  }

  getSvg() {
    return this.svg.node();
  }

  fitGraph() {
    this.svg.attr(
      'viewBox',
      `0 0 ${this.originalViewBox.width} ${this.originalViewBox.height}`
    );
  }

  unFitGraph() {
    const width = this.div.node().parentElement.parentElement.clientWidth;
    const height = this.div.node().parentElement.parentElement.clientHeight;
    this.svg.attr('viewBox', `0 0 ${(width * 3) / 4} ${(height * 3) / 4}`);
  }

  setZoomScale = (scale, center = false, reset = false) => {
    const viewBox = this.svg.attr('viewBox').split(' ');
    const bbox = this.graph0.node().getBBox();
    let { x, y, k } = d3_zoomTransform(this.graphviz.zoomSelection().node());
    const [x0, y0, scale0] = [x, y, k];
    const xOffset0 = x0 + bbox.x * scale0;
    const yOffset0 = y0 + bbox.y * scale0;
    const xCenter = viewBox[2] / 2;
    const yCenter = viewBox[3] / 2;
    let xOffset;
    let yOffset;
    if (center) {
      xOffset = (viewBox[2] - bbox.width * scale) / 2;
      yOffset = (viewBox[3] - bbox.height * scale) / 2;
    } else if (reset) {
      xOffset = 0;
      yOffset = 0;
    } else {
      xOffset = xCenter - ((xCenter - xOffset0) * scale) / scale0;
      yOffset = yCenter - ((yCenter - yOffset0) * scale) / scale0;
    }
    x = -bbox.x * scale + xOffset;
    y = -bbox.y * scale + yOffset;
    let transform = d3_zoomIdentity.translate(x, y).scale(scale);
    this.graphviz
      .zoomSelection()
      .call(this.graphviz.zoomBehavior().transform, transform);
  };

  handleRenderGraphReady() {
    this.svg = this.div.selectWithoutDataPropagation('svg');
    this.graph0 = this.svg.selectWithoutDataPropagation('g');
    this.dotGraph = this.prelDotGraph;
    this.addEventHandlers();
    this.rendering = false;
    if (!this.renderGraphReady) {
      this.renderGraphReady = true;
      this.setZoomScale(1, true);
      this.graphviz.transition(() =>
        d3_transition().duration(this.transitionDuration * 500)
      );
      this.onInitialized();
    }
    this.busy = false;
    if (this.pendingUpdate) {
      this.pendingUpdate = false;
      this.renderGraph();
    }
    this.addShadowToAllNode();
  }

  addShadowToAllNode() {
    let node_filter = d3_select('app-graph').selectAll('.node').append("defs").append("filter");
    node_filter.attr('id', 'drop-shadow');

    node_filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("result", "blur")
      .attr("stdDeviation", 2);

    node_filter.append("feOffset")
      .attr("result", "offsetBlur")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 1);

    let node_feMerge = node_filter.append("feMerge");
    node_feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
    node_feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    d3_select('app-graph').selectAll('.node').style("filter", "url(#drop-shadow)")
  }

  addEventHandlers() {
    let graph = this;
    this.graphviz.zoomBehavior().filter(function () {
      if (d3_event.type != 'mousedown') {
        return true;
      }

      if (graph.canMoveGraph) {
        if (graph.onSelect !== undefined) {
          graph.onSelect([]);
        }
        return true;
      }
      if (!d3_event.ctrlKey) {
        return false;
      }

      if (graph.isDrawingEdge) {
        return false;
      }

      return true;
    });

    const nodes = this.svg.selectAll('.node');
    const edges = this.svg.selectAll('.edge');
    const circles = this.svg.selectAll('.circle');
    const cross = this.svg.selectAll('.cross');
    d3_select(window).on('resize', this.resizeSVG.bind(this));
    this.div.on('click', this.handleClickDiv.bind(this));
    d3_select(document).on('keydown', this.handleKeyDownDocument.bind(this));
    this.div.on('mousemove', this.handleMouseMoveDiv.bind(this));
    this.div.on('contextmenu', this.handleRightClickDiv.bind(this));
    this.svg.on('mousedown', this.handleMouseDownSvg.bind(this));
    this.svg.on('mousemove', this.handleMouseMoveSvg.bind(this));
    this.svg.on('click', this.handleClickSvg.bind(this));
    this.svg.on('mouseup', this.handleMouseUpSvg.bind(this));
    nodes.on('click mousedown', this.handleClickNode.bind(this));
    nodes.on('click mouseup', this.handleClickUpNode.bind(this));
    circles.on('mousedown', this.handleClickCircle.bind(this));
    nodes.on('mouseenter', this.handleMouseEnterNode.bind(this));
    nodes.on('mouseleave', this.handleMouseLeaveNode.bind(this));
    // new event end
    edges.on('click mousedown', this.handleClickEdge.bind(this));
    cross.on('click mousedown', this.handleClickCross.bind(this));
  }

  resizeSVG() {
    const width = this.div.node().parentElement.parentElement.clientWidth;
    const height = this.div.node().parentElement.parentElement.clientHeight;
    const fit = this.fit;

    this.svg.attr('width', width).attr('height', height);
    if (!fit) {
      this.unFitGraph();
    }
  }

  handleClickDiv(d, i, nodes) {
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    (document.activeElement as any).blur();
    this.isOnFocus = true;
    const event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (!(event.which === 1 && (event.ctrlKey || event.shiftKey))) {
      this.unSelectComponents();
    }
  }

  removeMarkedRect() {
    this.selectRects.remove();
    this.selectRects = d3_select(null);
  }

  unSelectComponents() {
    this.removeMarkedRect();
    if (this.selectedComponents.size() > 0) {
      this.selectedComponents = d3_selectAll(null);
      this.selectNames.length = 0;
      if (this.onSelect !== undefined) {
        this.onSelect([]);
      }
    }
    this.canMoveGraph = false;
    this.isOnFocus = false;
    this.nodeBbox = undefined;
  }

  deleteSelectedComponents() {
    this.selectedComponents.style('display', 'none');
    const self = this;
    this.selectedComponents.each(function (d, i) {
      const component = d3_select(this);
      const componentName = component
        .selectWithoutDataPropagation('title')
        .text();
      if (component.attr('class') === 'node') {
        self.dotGraph.deleteNode(componentName);
      } else {
        self.dotGraph.deleteEdge(componentName);
      }
      if (self.dotGraph.numDeletedComponents === 0) {
        component.style('display', null);
      }
      if (i !== self.selectedComponents.size() - 1) {
        self.dotGraph.reparse();
      }
    });
    self.dotGraph.reparse();
    this.formatDotSrc();
    this.onTextChange(this.dotGraph.dotSrc);
    this.unSelectComponents();
  }

  selectAllComponents() {
    const components = this.graph0.selectAll('.node,.edge');
    this.selectComponents(components);
  }

  handleKeyDownDocument(d, i, nodes) {
    if (!this.hasFocus) {
      return;
    }
    const event = d3_event;
    if (event.target.nodeName !== 'BODY') {
      return;
    }

    if (event.key === '=') {
      this.handleZoomInButtonClick();
    } else if (event.key === '-') {
      this.handleZoomOutButtonClick();
    } else if (event.key === 'Escape') {
      this.graphviz.removeDrawnEdge();
      this.unSelectComponents();
      this.startPoints.forEach(item => item.remove());
      this.startPoints.length = 0;
      this.endPoints.forEach(item => item.remove());
      this.endPoints.length = 0;
    } else if (event.key === 'Delete') {
      this.deleteSelectedComponents.call(this);
      this.graphviz.removeDrawnEdge();
    } else if (event.ctrlKey && event.key === 'c') {
      const nodes = this.selectedComponents.filter('.node');
      if (nodes.size() > 0) {
        const nodeName = nodes.selectWithoutDataPropagation('title').text();
        this.latestNodeAttributes = this.dotGraph.getNodeAttributes(nodeName);
      }
    } else if (event.ctrlKey && event.key === 'v') {
      this.insertNodeWithLatestAttributes(null, null);
    } else if (event.ctrlKey && event.key === 'x') {
      const nodes = this.selectedComponents.filter('.node');
      if (nodes.size() > 0) {
        const nodeName = nodes.selectWithoutDataPropagation('title').text();
        this.latestNodeAttributes = this.dotGraph.getNodeAttributes(nodeName);
      }
      this.deleteSelectedComponents.call(this);
    } else if (event.ctrlKey && event.key === 'a') {
      this.selectAllComponents();
    } else if (event.ctrlKey && event.key === 'A') {
      const components = this.graph0.selectAll('.edge');
      this.selectComponents(components);
    } else if (event.ctrlKey && event.key === 'z') {
      this.onUndo();
    } else if (event.ctrlKey && event.key === 'y') {
      this.onRedo();
    } else if (event.key === '?') {
      this.onHelp();
    } else {
      return;
    }
    event.preventDefault();
    this.isDrawingEdge = false;
  }

  handleMouseMoveDiv(d, i, nodes) {
    const event = d3_event;
    if (!this.isResizing) {
      event.preventDefault();
      event.stopPropagation();
    }

    const [x0, y0] = d3_mouse(this.graph0.node());
    let penwidth = 1;
    if (this.latestEdgeAttributes.penwidth !== null) {
      if (isNumeric(this.latestEdgeAttributes.penwidth)) {
        penwidth = this.latestEdgeAttributes.penwidth;
      }
    } else if (
      this.latestEdgeAttributes.style &&
      this.latestEdgeAttributes.style.includes('bold')
    ) {
      penwidth = 2;
    }
    const shortening = penwidth * 4; // avoid mouse pointing on edge

    if (this.isDrawingEdge) {
      this.graphviz.moveDrawnEdgeEndPoint(x0, y0, { shortening: shortening });
    }
  }

  handleMouseLeaveNode(d, i, nodes) {
    let event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDrawingEdge && !this.isOnFocus) {
      this.startPoints.forEach(item => item.remove());
      this.startPoints.length = 0;
    }
  }

  handleMouseEnterNode(d, i, nodes) {
    let event = d3_event;
    event.preventDefault();
    if (!this.isDrawingEdge) {
      this.startPoints.forEach(item => item.remove());
      this.startPoints.length = 0;
      this.endPoints.forEach(item => item.remove());
      this.endPoints.length = 0;
    } else {
      this.endPoints.forEach(item => item.remove());
      this.endPoints.length = 0;
    }
    const component = d3_select(nodes[i]);
    const nodeTitle = component.select('title').text();

    const nodeAttr = this.dotGraph.getNodeAttributes(nodeTitle);
    if (!nodeAttr) return;
    const nodeUnit = this.dataService.getUnit(
      nodeAttr['flowunit'],
      nodeAttr['device']
    );
    // handle start points
    const textNodes = component.selectAll('text');
    const cr = this.pointCr;
    textNodes.nodes().forEach(item => {
      const itemComponent = d3_select(item);
      const itemBbox = itemComponent.node().getBBox();
      const itemTitle = itemComponent.text();
      if (nodeTitle === itemTitle) {
        return;
      }
      const linkName = nodeTitle + ':' + itemTitle;
      const nodeport_type = this.dataService.getport_type(nodeUnit, linkName);
      if (!nodeUnit) {
        return;
      }
      // 起点
      if (!this.isDrawingEdge && nodeport_type === 'input') {
        return;
      }
      // 终点
      if (this.isDrawingEdge && nodeport_type === 'output') {
        return;
      }

      if (this.startNode) {
        const startNodeName = this.startNode
          .attr('data-link-name')
          .replace(/:.*$/, '');
        if (this.isDrawingEdge && startNodeName === nodeTitle) {
          return;
        }
      }
      const point = component
        .append('circle')
        .attr('data-link-name', linkName)
        .attr('class', 'circle')
        .attr('r', cr)
        .attr('cx', itemBbox.x + itemBbox.width / 2)
        .attr('cy', itemBbox.y + itemBbox.height - cr)
        .attr('stroke', '#575D6C')
        .attr('cursor', 'crosshair')
        .attr('fill', 'white');
      if (!this.isDrawingEdge) {
        this.startPoints.push(point);
      } else {
        point
          .attr('cx', itemBbox.x + itemBbox.width / 2)
          .attr('cy', itemBbox.y + cr);
        this.endPoints.push(point);
      }
    });
    this.addEventHandlers();
  }

  blurActiveElement() {
    (document.activeElement as any).blur();
  }

  handleRightClickDiv(d, i, nodes) {
    const event = d3_event;
    if (this.isDrawingEdge) {
      // cancel edgeing
      event.preventDefault();
      this.isDrawingEdge = false;
      this.graphviz.removeDrawnEdge();
      this.unSelectComponents();
      this.startPoints.forEach(item => item.remove());
      this.startPoints.length = 0;
      this.endPoints.forEach(item => item.remove());
      this.endPoints.length = 0;
      this.isDrawingEdge = false;
      this.isOnFocus = false;
      return;
    }
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    this.blurActiveElement();
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
  }

  handleMouseDownSvg(d, i, nodes) {
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    this.blurActiveElement();
    const event = d3_event;
    if (event.which !== 1) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.selectArea) {
      return;
    }
    const [x0, y0] = d3_mouse(this.graph0.node());
    this.selectArea = { x0: x0, y0: y0 };
    const offset = 1; // avoid covering the svg at click in Chrome
    this.selectArea.selection = this.graph0
      .append('rect')
      .attr('x', x0 + offset)
      .attr('y', y0 + offset)
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', '#99ccff')
      .attr('stroke', '#0000dd')
      .style('stroke-width', 0.5)
      .style('fill-opacity', 0.3);
  }

  handleMouseMoveSvg(d, i, nodes) {
    const event = d3_event;
    if (this.selectArea) {
      event.preventDefault();
      event.stopPropagation();
      const { x0, y0 } = this.selectArea;
      const [x1, y1] = d3_mouse(this.graph0.node());
      const x = Math.min(x0, x1);
      const y = Math.min(y0, y1);
      const width = Math.abs(x1 - x0);
      const height = Math.abs(y1 - y0);
      this.selectArea.selection
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height);
    }
  }

  handleClickSvg(d, i, nodes) {
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    this.blurActiveElement();
    this.isOnFocus = false;
    this.startPoints.forEach(item => item.remove());
    this.startPoints.length = 0;
    let event = d3_event;
    if (event.which === 1 && this.selectArea) {
      event.preventDefault();
      event.stopPropagation();
      this.selectArea.selection.remove();
      const { x0, y0 } = this.selectArea;
      const [x1, y1] = d3_mouse(this.graph0.node());
      const x = Math.min(x0, x1);
      const y = Math.min(y0, y1);
      const width = Math.abs(x1 - x0);
      const height = Math.abs(y1 - y0);
      if (width === 0 && height === 0) {
        this.selectArea = null;
        if (!(event.ctrlKey || event.shiftKey)) {
          this.unSelectComponents();
        }
        return;
      }
      let components = this.graph0.selectAll('.node,.edge');
      components = components.filter(function (d, i) {
        let bbox = this.getBBox();
        if (bbox.x < x || bbox.x + bbox.width > x + width) {
          return false;
        }
        if (bbox.y < y || bbox.y + bbox.height > y + height) {
          return false;
        }
        return true;
      });
      this.selectComponents(components);
      this.selectArea = null;
    }
  }

  handleMouseUpSvg(d, i, nodes) {
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    this.blurActiveElement();
    let event = d3_event;
    if (event.which === 2) {
      const [x0, y0] = d3_mouse(this.graph0.node());
      if (event.shiftKey) {
        this.insertNodeWithDefaultAttributes(x0, y0, {
          shape: this.latestInsertedNodeData.shape,
        });
      } else {
        this.insertNodeWithLatestAttributes(x0, y0);
      }
    }
  }

  insertNodeWithDefaultAttributes(x0, y0, attributesToOverride = {}) {
    this.latestNodeAttributes = { ...this.defaultNodeAttributes };
    this.insertNodeWithLatestAttributes(x0, y0, attributesToOverride);
  }

  insertNodeWithLatestAttributes(x0, y0, data = {}) {
    if (x0 === null || y0 === null) {
      let node = this.graph0.node();
      let bbox = node.getBBox();
      x0 = x0 || bbox.x + bbox.width / 2;
      y0 = y0 || bbox.y + bbox.height / 2;
    }
    Object.assign(this.latestNodeAttributes, data);
    if (Object.keys(data).length === 0) {
      return;
    }

    //TODO save last node information for middle mouse buttion
    let nodeName = this.getNextNodeId(data);
    if (this.latestNodeAttributes.label) {
      this.latestNodeAttributes.label = this.latestNodeAttributes.label.replace(
        '_NODE_NAME_',
        nodeName
      );
    }
    this.insertNode(x0, y0, nodeName, this.latestNodeAttributes);
  }

  insertNode(x0, y0, nodeName, attributes) {
    this.removeMarkedRect();
    this.drawNode(x0, y0, nodeName, null);
    this.graphviz.insertDrawnNode(nodeName);
    this.dotGraph.insertNode(nodeName, attributes);
    this.dotGraph.reparse();
    this.formatDotSrc();
    this.onTextChange(this.dotGraph.dotSrc);
  }

  drawNode(x0, y0, nodeName, attributes) {
    attributes = {
      shape: 'Mrecord',
      ...attributes,
    };

    this.graphviz.drawNode(x0, y0, nodeName, attributes);
  }

  getNextNodeId(data) {
    if (this.nodeIndex === null) {
      this.nodeIndex = d3_select('app-graph').selectAll('.node').size();
    } else {
      this.nodeIndex += 1;
    }
    while (this.dotGraph.getNodeAttributes(data.flowunit + this.nodeIndex)) {
      this.nodeIndex += 1;
    }
    return data.flowunit + this.nodeIndex;
  }

  handleClickEdge(d, i, nodes) {
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    this.blurActiveElement();
    let event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.selectComponents(d3_select(nodes[i]));
  }

  isSameBbox(bbox) {
    if (this.nodeBbox === undefined) {
      this.nodeBbox = bbox;
    } else {
      if (this.nodeBbox.height === bbox.height &&
        this.nodeBbox.x === bbox.x &&
        this.nodeBbox.y === bbox.y) {
        bbox = this.nodeBbox
      }
    }
    return bbox;
  }

  markSelectedComponents(components, extendSelection = false) {
    const rectNodes = [];
    const titles = [];
    const self = this;
    let pattern = /label="*"/;
    if (!this.extended && !pattern.test(this.dotSrc)) {
      extendSelection = true;
      this.extended = true;
    }
    components.each(function (d, i) {
      const component = d3_select(this);
      let color = '#5E7CE0';
      const title = component.select('title').text();
      if (
        component.classed('edge') &&
        self.dotGraph.getEdgeAttributes(title) === null
      ) {
        color = 'red';
      } else {
        titles.push(title);
      }
      let bbox = component.node().getBBox();
      bbox = self.isSameBbox(bbox);
      if (bbox.height <= self.maxHeight) {
        if (!extendSelection) {
          const rect = component
            .append('rect')
            .attr('x', bbox.x)
            .attr('y', bbox.y)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('width', bbox.width)
            .attr('height', bbox.height)
            .attr('stroke', color)
            .attr('fill', 'transparent')
            .attr('stroke-width', 2);
          rectNodes.push(rect.node());
          if (component.classed('node')) {
            let r = 6;
            const g = component.append('g').attr('width', 16).attr('height', 16)
            const circle = g
              .append('circle')
              .attr('class', 'cross')
              .attr('r', r)
              .attr('cx', bbox.x + bbox.width + r + 3)
              .attr('cy', bbox.y + bbox.height / 2 - r)
              .attr('stroke', '#575D6C')
              .attr('cursor', 'pointer')
              .attr('fill', 'white');
            const a = g
              .append('line')
              .attr('class', 'cross')
              .attr("x1", bbox.x + bbox.width + 4 + r / 2)
              .attr("x2", bbox.x + bbox.width + 2 + 1.5 * r)
              .attr("y1", bbox.y + bbox.height / 2 - 1.4 * r)
              .attr("y2", bbox.y + bbox.height / 2 - 0.6 * r)
              .attr('cursor', 'pointer')
              .attr("stroke", "#575D6C")
              .attr("stroke-width", "2");
            const b = g
              .append('line')
              .attr('class', 'cross')
              .attr("x1", bbox.x + bbox.width + 2 + 1.5 * r)
              .attr("x2", bbox.x + bbox.width + 4 + r / 2)
              .attr("y1", bbox.y + bbox.height / 2 - 1.4 * r)
              .attr("y2", bbox.y + bbox.height / 2 - 0.6 * r)
              .attr('cursor', 'pointer')
              .attr("stroke", "#575D6C")
              .attr("stroke-width", "2")
            rectNodes.push(g.node());
          }
        }
      }
    }

    );


    if (extendSelection) {
      this.selectRects = d3_selectAll(
        this.selectRects.nodes().concat(rectNodes)
      );
      this.selectNames = titles;
    } else {
      this.selectRects = d3_selectAll(rectNodes);
      this.selectNames = titles;
    }

  }

  getLabelFromEdge(name, edges) {
    let input = [];
    let output = [];

    for (let edge in edges) {
      const [start, end] = edge.split('->');
      const [startname, outport] = start.split(':');
      const [endname, inport] = end.split(':');
      if (startname == name && outport) {
        if (output.includes(outport)) {
          continue;
        }
        output.push(outport);
      } else if (endname == name && inport) {
        if (input.includes(inport)) {
          continue;
        }
        input.push(inport);
      }
    }

    let label;
    let parts = [];
    if (input.length > 0) {
      parts.push(
        '{' +
        input.map(item => `<${item}> ${item}`).join('|') +
        '}'
      );
    }
    parts.push(name);
    if (output.length > 0) {
      parts.push(
        '{' +
        output.map(item => `<${item}> ${item}`).join('|') +
        '}'
      );
    }

    label = '{' + parts.join('|') + '}';

    return label;
  }

  selectComponents(components, extendSelection = false) {
    if (extendSelection) {
      this.selectedComponents = d3_selectAll(
        this.selectedComponents.nodes().concat(components.nodes())
      );
    } else {
      this.unSelectComponents();
      this.selectedComponents = components;
    }
    this.markSelectedComponents(components, extendSelection);
    const selectedComponents = this.selectNames.map(name => {
      return {
        ...this.dotGraph.components[name],
        name: name,
      };
    });
    if (this.onSelect !== undefined) {
      this.onSelect(selectedComponents);
    }
    if (selectedComponents.length >= 1) {
      this.canMoveGraph = true;
      let name = selectedComponents[0]["name"]
      if (selectedComponents.length == 1) {
        const Attr = this.dotGraph.getNodeAttributes(name);
        if (Attr !== null && typeof Attr["label"] != "undefined") {
          if (Attr["label"].length > 1 && Attr["label"] == this.getLabelFromEdge(name, this.dotGraph.edges)) {
            return;
          }
        }

        this.formatDotSrc();
        if (this.onTextChange !== undefined) {
          this.onTextChange(this.dotGraph.dotSrc);
        }
      }
    }
  }

  handleClickNode(d, i, nodes) {
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    this.blurActiveElement();
    this.isOnFocus = true;
    let event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDrawingEdge && event.which === 1) {
      this.selectComponents(d3_select(nodes[i]));
    }
    this.formatDotSrc();
    this.onTextChange(this.dotGraph.dotSrc);
  }

  handleClickUpNode(d, i, nodes) {
    if (this.onFocus !== undefined) {
      this.onFocus();
    }
    this.isOnFocus = true;
    this.blurActiveElement();
    let event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.handleMouseEnterNode(d, i, nodes);
  }

  canLink(startLinkName, endLinkName): boolean {
    const startNodeName = startLinkName.replace(/:.+$/, '');
    const endNodeName = endLinkName.replace(/:.+$/, '');
    if (startNodeName === endNodeName) {
      const results = this.dialogService.open({
        id: 'dialog-service',
        width: '346px',
        maxHeight: '600px',
        title: '',
        content: this.i18n.getById('message.cannotConnectToSelf'),
        backdropCloseable: true,
        dialogtype: 'failed',
        buttons: [
          {
            cssClass: 'primary',
            text: 'Ok',
            handler: ($event: Event) => {
              results.modalInstance.hide();
              results.modalInstance.zIndex = -1;
            },
          }
        ],
      });
      return false;
    }
    const startAttr = this.dotGraph.getNodeAttributes(startNodeName);
    const endAttr = this.dotGraph.getNodeAttributes(endNodeName);
    const startUnit = this.dataService.getUnit(
      startAttr['flowunit'],
      startAttr['device']
    );
    const endUnit = this.dataService.getUnit(
      endAttr['flowunit'],
      endAttr['device']
    );
    const startport_type = this.dataService.getport_type(
      startUnit,
      startLinkName
    );
    const endport_type = this.dataService.getport_type(endUnit, endLinkName);

    for (let edge in this.dotGraph.edges) {
      const [start, end] = edge.split('->');
      if (start === startLinkName && end === endLinkName) {
        return false;
      }
    }
    return true;
  }

  handleClickCross(d, i, nodes) {
    this.deleteSelectedComponents.call(this);
  }

  handleClickCircle(d, i, nodes) {
    this.onFocus();
    this.blurActiveElement();
    let event = d3_event;
    // circle自己不处理 right click事件
    if (event.which === 3) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
    if (this.isDrawingEdge) {
      let endNode = d3_select(nodes[i]);
      let startNodeName = this.startNode.attr('data-link-name');
      let endNodeName = endNode.attr('data-link-name');
      // 限制连接
      if (!this.canLink(startNodeName, endNodeName)) {
        return;
      }
      // end
      let startnode = startNodeName.split(':');
      let endnode = endNodeName.split(':');
      startNodeName = startnode[0] + ':\"' + startnode[1] + '\"';
      endNodeName = endnode[0] + ':\"' + endnode[1] + '\"';
      this.graphviz.insertDrawnEdge(startNodeName + '->' + endNodeName);
      this.latestEdgeAttributes = Object.assign({}, this.defaultEdgeAttributes);
      this.dotGraph.insertEdge(
        startNodeName,
        endNodeName,
        this.latestEdgeAttributes
      );
      this.dotGraph.reparse();
      this.formatDotSrc();
      this.onTextChange(this.dotGraph.dotSrc);
      this.startPoints.forEach(item => item.remove());
      this.startPoints.length = 0;
      this.endPoints.forEach(item => item.remove());
      this.endPoints.length = 0;
      this.isDrawingEdge = false;
      return;
    }

    this.graphviz.removeDrawnEdge();
    this.startNode = d3_select(nodes[i]);
    let [x0, y0] = d3_mouse(this.graph0.node());
    if (this.edgeIndex === null || typeof this.edgeIndex === 'undefined') {
      this.edgeIndex = d3_selectAll('.edge').size();
    } else {
      this.edgeIndex += 1;
    }
    this.latestEdgeAttributes = { ...this.defaultEdgeAttributes };
    this.latestEdgeAttributes.id = 'edge' + (this.edgeIndex + 1);
    this.graphviz.drawEdge(x0, y0, x0, y0, this.latestEdgeAttributes);
    this.isDrawingEdge = true;
  }
}
