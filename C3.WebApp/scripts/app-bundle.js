define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'C3';
            config.map([
                { route: ['', 'system-context-diagram/:id'], name: 'system-context-diagram',
                    moduleId: 'system-context-diagram/system-context-diagram', title: 'System Context Diagram' },
                { route: 'container-diagram/:id', name: 'container-diagram',
                    moduleId: 'container-diagram/container-diagram', title: 'Container Diagram' },
                { route: 'component-diagram/:id', name: 'component-diagram',
                    moduleId: 'component-diagram/component-diagram', title: 'Component Diagram' },
                { route: 'admin', name: 'admin', moduleId: 'admin/admin',
                    nav: true, title: 'Admin' }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('common/model',["require", "exports"], function (require, exports) {
    "use strict";
});

define('common/path-finder',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var logger = aurelia_framework_1.LogManager.getLogger('pathFinder');
    function cartesianProduct(array) {
        var reduce = array.reduce(function (previousValue, currentValue) {
            var aMap = previousValue.map(function (value) {
                var bMap = currentValue.map(function (innerValue) {
                    var concat = value.concat(innerValue);
                    return concat;
                });
                return bMap;
            });
            var aMapReduce = aMap.reduce(function (innerPreviousValue, innerCurrentValue) {
                var concat = innerPreviousValue.concat(innerCurrentValue);
                return concat;
            }, []);
            return aMapReduce;
        }, [[]]);
        return reduce;
    }
    exports.cartesianProduct = cartesianProduct;
    function lengthOf(path) {
        var length = path.reduce(function (previousValue, currentValue, currentIndex, array) {
            if (currentIndex === 0)
                return 0;
            var a = currentValue.x - array[currentIndex - 1].x;
            var b = currentValue.y - array[currentIndex - 1].y;
            var currentLength = Math.sqrt(a * a + b * b);
            return previousValue + currentLength;
        }, 0);
        return length;
    }
    exports.lengthOf = lengthOf;
    var StraightPathFinder = (function () {
        function StraightPathFinder() {
        }
        StraightPathFinder.prototype.findPath = function (sourceConnectionPoints, targetConnectionPoints, diagram) {
            var _this = this;
            var connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);
            var shortestConnectionPointCombination = connectionPointCombinations.reduce(function (previousShortestConnectionPoints, currentConnectionPoints) {
                var previousPath = _this.findAPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1]);
                var currentPath = _this.findAPath(currentConnectionPoints[0], currentConnectionPoints[1]);
                var previousLength = lengthOf(previousPath);
                var currentLength = lengthOf(currentPath);
                var shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
                return shorterPath;
            });
            var path = this.findAPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1]);
            return path;
        };
        StraightPathFinder.prototype.findAPath = function (sourcePoint, targetPoint) {
            var directPath = [sourcePoint, targetPoint];
            return directPath;
        };
        return StraightPathFinder;
    }());
    exports.StraightPathFinder = StraightPathFinder;
    var PerpendicularPathFinder = (function () {
        function PerpendicularPathFinder() {
            this.veryLongPath = [{ x: 0, y: 0 }, { x: 10000, y: 10000 }];
        }
        PerpendicularPathFinder.prototype.findPath = function (sourceConnectionPoints, targetConnectionPoints, diagram) {
            var _this = this;
            var connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);
            var shortestPath = connectionPointCombinations.reduce(function (previousShortestPath, currentConnectionPoints) {
                var currentShortestPath = _this.findShortestPath(currentConnectionPoints[0], currentConnectionPoints[1]);
                var previousLength = lengthOf(previousShortestPath);
                var currentLength = lengthOf(currentShortestPath);
                var shorterPath = (currentLength < previousLength) ? currentShortestPath : previousShortestPath;
                return shorterPath;
            }, this.veryLongPath);
            return shortestPath;
        };
        PerpendicularPathFinder.prototype.findShortestPath = function (sourcePoint, targetPoint) {
            var diffX = targetPoint.x - sourcePoint.x;
            var diffY = targetPoint.y - sourcePoint.y;
            if (diffX > diffY) {
                var path1 = [sourcePoint,
                    { x: sourcePoint.x + diffX / 2, y: sourcePoint.y },
                    { x: sourcePoint.x + diffX / 2, y: targetPoint.y },
                    targetPoint];
                return path1;
            }
            else {
                var path2 = [sourcePoint,
                    { x: sourcePoint.x, y: sourcePoint.y + diffY / 2 },
                    { x: targetPoint.x, y: sourcePoint.y + diffY / 2 },
                    targetPoint];
                return path2;
            }
        };
        return PerpendicularPathFinder;
    }());
    exports.PerpendicularPathFinder = PerpendicularPathFinder;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('common/selection-box',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var SelectionBox = (function () {
        function SelectionBox() {
            this.width = 0;
            this.height = 0;
        }
        SelectionBox.prototype.startPan = function () {
            this.startX = this.x;
            this.startY = this.y;
        };
        SelectionBox.prototype.pan = function (deltaX, deltaY) {
            if (deltaX >= 0) {
                this.width = deltaX;
            }
            else {
                this.x = this.startX + deltaX;
                this.width = Math.abs(deltaX);
            }
            if (deltaY >= 0) {
                this.height = deltaY;
            }
            else {
                this.y = this.startY + deltaY;
                this.height = Math.abs(deltaY);
            }
        };
        SelectionBox.prototype.containsRect = function (x, y, width, height) {
            var contains = x >= this.x && x + width < this.x + this.width &&
                y >= this.y && y + height < this.y + this.height;
            return contains;
        };
        return SelectionBox;
    }());
    SelectionBox = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [])
    ], SelectionBox);
    exports.SelectionBox = SelectionBox;
});

define('common/diagram-base',["require", "exports", "./selection-box", "hammerjs"], function (require, exports, selection_box_1) {
    "use strict";
    var BoundingBox = (function () {
        function BoundingBox(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return BoundingBox;
    }());
    exports.BoundingBox = BoundingBox;
    var DiagramBase = (function () {
        function DiagramBase() {
        }
        DiagramBase.prototype.getBoundingBox = function () {
            var nodes = this.getNodes();
            var edges = this.getEdges();
            var left;
            var right;
            var top;
            var bottom;
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                if (!left || left > node.x)
                    left = node.x;
                if (!right || right < node.x + node.width)
                    right = node.x + node.width - 1;
                if (!top || top > node.y)
                    top = node.y;
                if (!bottom || bottom < node.y + node.height)
                    bottom = node.y + node.height - 1;
            }
            for (var _a = 0, edges_1 = edges; _a < edges_1.length; _a++) {
                var edge = edges_1[_a];
                for (var _b = 0, _c = edge.path; _b < _c.length; _b++) {
                    var point = _c[_b];
                    if (!left || left > point.x)
                        left = point.x;
                    if (!right || right < point.x)
                        right = point.x;
                    if (!top || top > point.y)
                        top = point.y;
                    if (!bottom || bottom < point.y)
                        bottom = point.y;
                }
            }
            if (!left || !right || !top || !bottom)
                return new BoundingBox(0, 0, 0, 0);
            var width = right - left + 1;
            var height = bottom - top + 1;
            return new BoundingBox(left, top, width, height);
        };
        DiagramBase.prototype.unselectAll = function () {
            for (var _i = 0, _a = this.getNodes(); _i < _a.length; _i++) {
                var c = _a[_i];
                c.isSelected = false;
            }
            ;
        };
        DiagramBase.prototype.getContainerHit = function (x, y) {
            for (var _i = 0, _a = this.getNodes(); _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.isHit(x, y)) {
                    return c;
                }
            }
            return null;
        };
        DiagramBase.prototype.attachHammerEventHandler = function (element) {
            var self = this;
            var hammertime = new Hammer(element);
            hammertime.on('panstart', function (event) {
                self.onPanStart(event, element);
            });
            hammertime.on('pan', function (event) {
                self.onPan(event);
            });
            hammertime.on('panend', function (event) {
                self.onPanEnd(event);
            });
            hammertime.on('tap', function (event) {
                self.onTap(event, element);
            });
        };
        DiagramBase.prototype.onPanStart = function (event, element) {
            var clientRect = element.getBoundingClientRect();
            var eventX = event.pointers[0].x - clientRect.left;
            var eventY = event.pointers[0].y - clientRect.top;
            var containerHit = this.getContainerHit(eventX, eventY);
            if (containerHit !== null) {
                if (!containerHit.isSelected) {
                    if (!event.srcEvent.ctrlKey) {
                        this.unselectAll();
                    }
                    containerHit.isSelected = true;
                }
                for (var _i = 0, _a = this.getNodes(); _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (c.isSelected) {
                        c.startPan();
                    }
                }
                this.isPanning = true;
                return;
            }
            else {
                this.unselectAll();
                this.selectionBox = new selection_box_1.SelectionBox();
                this.selectionBox.x = eventX;
                this.selectionBox.y = eventY;
                this.selectionBox.startPan();
            }
        };
        DiagramBase.prototype.onPan = function (event) {
            if (this.isPanning) {
                for (var _i = 0, _a = this.getNodes(); _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (c.isSelected) {
                        c.pan(event.deltaX, event.deltaY);
                    }
                }
                for (var _b = 0, _c = this.getEdges(); _b < _c.length; _b++) {
                    var e = _c[_b];
                    e.updatePath();
                }
            }
            else {
                this.selectionBox.pan(event.deltaX, event.deltaY);
                for (var _d = 0, _e = this.getNodes(); _d < _e.length; _d++) {
                    var c = _e[_d];
                    c.isSelected = this.selectionBox.containsRect(c.x, c.y, c.width, c.height);
                }
            }
        };
        DiagramBase.prototype.onPanEnd = function (event) {
            if (this.isPanning) {
                for (var _i = 0, _a = this.getNodes(); _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (c.isSelected) {
                        c.endPan();
                    }
                }
                this.isPanning = false;
                for (var _b = 0, _c = this.getEdges(); _b < _c.length; _b++) {
                    var e = _c[_b];
                    e.updatePath();
                }
            }
            else {
                this.selectionBox = null;
            }
        };
        DiagramBase.prototype.onTap = function (event, element) {
            var clientRect = element.getBoundingClientRect();
            var eventX = event.pointers[0].x - clientRect.left;
            var eventY = event.pointers[0].y - clientRect.top;
            for (var _i = 0, _a = this.getNodes(); _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.isHit(eventX, eventY)) {
                    if (event.srcEvent.ctrlKey) {
                        c.isSelected = !c.isSelected;
                    }
                    else {
                        this.unselectAll();
                        c.isSelected = true;
                    }
                    return;
                }
            }
            this.unselectAll();
        };
        return DiagramBase;
    }());
    exports.DiagramBase = DiagramBase;
});

define('common/edge-base',["require", "exports"], function (require, exports) {
    "use strict";
    var EdgeBase = (function () {
        function EdgeBase(pathFinder) {
            this.pathFinder = pathFinder;
            this.path = [];
        }
        EdgeBase.prototype.updatePath = function () {
            if (this.areNodesOverlapping())
                return;
            var sourceConnectionPoints = this.sourceNode.getConnectionPoints();
            var targetConnectionPoints = this.targetNode.getConnectionPoints();
            this.path = this.pathFinder.findPath(sourceConnectionPoints, targetConnectionPoints, this.parentDiagram);
        };
        EdgeBase.prototype.areNodesOverlapping = function () {
            var overlapping = this.sourceNode.x + this.sourceNode.width > this.targetNode.x
                && this.sourceNode.x < this.targetNode.x + this.targetNode.width
                && this.sourceNode.y + this.sourceNode.height > this.targetNode.y
                && this.sourceNode.y < this.targetNode.y + this.targetNode.height;
            return overlapping;
        };
        return EdgeBase;
    }());
    exports.EdgeBase = EdgeBase;
});

define('common/node-base',["require", "exports"], function (require, exports) {
    "use strict";
    var NodeBase = (function () {
        function NodeBase() {
        }
        NodeBase.prototype.isHit = function (x, y) {
            var hit = !(x < this.x || x >= this.x + this.width ||
                y < this.y || y >= this.y + this.height);
            return hit;
        };
        NodeBase.prototype.startPan = function () {
            this.startX = this.x;
            this.startY = this.y;
        };
        NodeBase.prototype.pan = function (deltaX, deltaY) {
            var newX = this.startX + deltaX;
            if (newX < 0)
                newX = 0;
            this.x = Math.round(newX / 10) * 10;
            var newY = this.startY + deltaY;
            if (newY < 0)
                newY = 0;
            this.y = Math.round(newY / 10) * 10;
        };
        NodeBase.prototype.endPan = function () {
            this.startX = undefined;
            this.startY = undefined;
        };
        NodeBase.prototype.getConnectionPoints = function () {
            var center = this.getCenter();
            var topCenter = {
                x: this.x + this.width / 2,
                y: this.y
            };
            var bottomCenter = {
                x: this.x + this.width / 2,
                y: this.y + this.height - 1
            };
            var leftCenter = {
                x: this.x,
                y: this.y + this.height / 2
            };
            var rightCenter = {
                x: this.x + this.width - 1,
                y: this.y + this.height / 2
            };
            return [center];
        };
        NodeBase.prototype.getCenter = function () {
            var centerX = this.x + this.width / 2;
            var centerY = this.y + this.height / 2;
            return { x: centerX, y: centerY };
        };
        return NodeBase;
    }());
    exports.NodeBase = NodeBase;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('system-context-diagram/actor-node',["require", "exports", "../common/node-base"], function (require, exports, node_base_1) {
    "use strict";
    var ActorNode = (function (_super) {
        __extends(ActorNode, _super);
        function ActorNode() {
            var _this = _super.call(this) || this;
            _this.width = 200;
            _this.height = 200;
            return _this;
        }
        ActorNode.prototype.updateFromModel = function (model) {
            this.id = model.id;
            this.name = model.name;
            this.x = model.x;
            this.y = model.y;
            this.width = model.width;
            this.height = model.height;
        };
        ActorNode.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.x = this.x;
            model.y = this.y;
            model.width = this.width;
            model.height = this.height;
            return model;
        };
        return ActorNode;
    }(node_base_1.NodeBase));
    exports.ActorNode = ActorNode;
});

define('common/binary-heap',["require", "exports"], function (require, exports) {
    "use strict";
    var BinaryHeap = (function () {
        function BinaryHeap(scoreFunction) {
            this.scoreFunction = scoreFunction;
            this.content = [];
        }
        BinaryHeap.prototype.push = function (element) {
            this.content.push(element);
            this.sinkDown(this.content.length - 1);
        };
        BinaryHeap.prototype.pop = function () {
            var result = this.content[0];
            var end = this.content.pop();
            if (this.content.length > 0) {
                this.content[0] = end;
                this.bubbleUp(0);
            }
            return result;
        };
        BinaryHeap.prototype.remove = function (element) {
            var i = this.content.indexOf(element);
            var end = this.content.pop();
            if (i !== this.content.length - 1) {
                this.content[i] = end;
                if (this.scoreFunction(end) < this.scoreFunction(element)) {
                    this.sinkDown(i);
                }
                else {
                    this.bubbleUp(i);
                }
            }
        };
        BinaryHeap.prototype.rescore = function (element) {
            this.sinkDown(this.content.indexOf(element));
        };
        Object.defineProperty(BinaryHeap.prototype, "size", {
            get: function () {
                return this.content.length;
            },
            enumerable: true,
            configurable: true
        });
        BinaryHeap.prototype.sinkDown = function (n) {
            var node = this.content[n];
            while (n > 0) {
                var parentN = ((n + 1) >> 1) - 1;
                var parent = this.content[parentN];
                if (this.scoreFunction(node) < this.scoreFunction(parent)) {
                    this.content[parentN] = node;
                    this.content[n] = parent;
                    n = parentN;
                }
                else {
                    break;
                }
            }
        };
        BinaryHeap.prototype.bubbleUp = function (n) {
            var length = this.content.length;
            var element = this.content[n];
            var elemScore = this.scoreFunction(element);
            while (true) {
                var child2N = (n + 1) << 1;
                var child1N = child2N - 1;
                var swap = null;
                var child1Score;
                if (child1N < length) {
                    var child1 = this.content[child1N];
                    child1Score = this.scoreFunction(child1);
                    if (child1Score < elemScore) {
                        swap = child1N;
                    }
                }
                if (child2N < length) {
                    var child2 = this.content[child2N];
                    var child2Score = this.scoreFunction(child2);
                    if (child2Score < (swap === null ? elemScore : child1Score)) {
                        swap = child2N;
                    }
                }
                if (swap !== null) {
                    this.content[n] = this.content[swap];
                    this.content[swap] = element;
                    n = swap;
                }
                else {
                    break;
                }
            }
        };
        return BinaryHeap;
    }());
    exports.BinaryHeap = BinaryHeap;
});

define('common/astar-path-finder',["require", "exports", "aurelia-framework", "./path-finder", "./binary-heap"], function (require, exports, aurelia_framework_1, path_finder_1, binary_heap_1) {
    "use strict";
    var logger = aurelia_framework_1.LogManager.getLogger('astar');
    var gridSpacing = 10;
    var Node = (function () {
        function Node(point) {
            this.visited = false;
            this.closed = false;
            this.gScore = 0;
            this.isOccupied = false;
            this.x = point.x;
            this.y = point.y;
        }
        Node.prototype.fScore = function (endNode) {
            var fScore = this.gScore + this.hScore(endNode);
            return fScore;
        };
        ;
        Node.prototype.hScore = function (endNode) {
            if (!this._hScore)
                this._hScore = manhattanHeuristic(this, endNode);
            return this._hScore;
        };
        return Node;
    }());
    var GraphForDiagram = (function () {
        function GraphForDiagram(diagram) {
            this.diagram = diagram;
            this.diagramBoundingBox = this.diagram.getBoundingBox();
            this.buildGrid();
        }
        GraphForDiagram.prototype.getNode = function (point) {
            var x = point.x - this.diagramBoundingBox.x;
            var y = point.y - this.diagramBoundingBox.y;
            var gridY = this.toGrid(y);
            var gridX = this.toGrid(x);
            var node = this.grid[gridY][gridX];
            return node;
        };
        GraphForDiagram.prototype.getCost = function (node, previousNode, penultimateNode) {
            if (node.isOccupied) {
                return 1000;
            }
            if (!previousNode || !penultimateNode
                || node.x === previousNode.x && previousNode.x === penultimateNode.x
                || node.y === previousNode.y && previousNode.y === penultimateNode.y)
                return 1;
            return 10;
        };
        GraphForDiagram.prototype.getFullPath = function (endNode) {
            var currentNode = endNode;
            var path = [];
            while (currentNode.parent) {
                var point = { x: currentNode.x + this.diagramBoundingBox.x,
                    y: currentNode.y + this.diagramBoundingBox.y };
                path.unshift(point);
                currentNode = currentNode.parent;
            }
            return path;
        };
        GraphForDiagram.prototype.toGrid = function (value) {
            if (value % gridSpacing !== 0)
                value = value - value % gridSpacing;
            return value / gridSpacing;
        };
        GraphForDiagram.prototype.getNeighbors = function (node) {
            if (this.diagramBoundingBox.width === 0 || this.diagramBoundingBox.height === 0)
                return [];
            var neighbors = [];
            if (node.x > 0) {
                var leftNeighbor = this.grid[this.toGrid(node.y)][this.toGrid(node.x) - 1];
                neighbors.push(leftNeighbor);
            }
            if (node.x < this.diagramBoundingBox.width - 1) {
                var rightNeighbor = this.grid[this.toGrid(node.y)][this.toGrid(node.x) + 1];
                neighbors.push(rightNeighbor);
            }
            if (node.y > 0) {
                var topNeighbor = this.grid[this.toGrid(node.y) - 1][this.toGrid(node.x)];
                neighbors.push(topNeighbor);
            }
            if (node.y < this.diagramBoundingBox.height - 1) {
                var bottomNeighbor = this.grid[this.toGrid(node.y) + 1][this.toGrid(node.x)];
                neighbors.push(bottomNeighbor);
            }
            return neighbors;
        };
        GraphForDiagram.prototype.buildGrid = function () {
            this.grid = [];
            for (var i = 0; i <= this.diagramBoundingBox.height; i = i + gridSpacing) {
                var row = [];
                for (var j = 0; j <= this.diagramBoundingBox.width; j = j + gridSpacing) {
                    var node = new Node({ x: j, y: i });
                    node.isOccupied = this.isDiagramNodeHit(node);
                    row.push(node);
                }
                this.grid.push(row);
            }
        };
        GraphForDiagram.prototype.isDiagramNodeHit = function (node) {
            var diagramX = node.x + this.diagramBoundingBox.x;
            var diagramY = node.y + this.diagramBoundingBox.y;
            var diagramNodes = this.diagram.getNodes();
            for (var _i = 0, diagramNodes_1 = diagramNodes; _i < diagramNodes_1.length; _i++) {
                var diagramNode = diagramNodes_1[_i];
                if (diagramNode.isHit(diagramX, diagramY))
                    return true;
            }
            return false;
        };
        return GraphForDiagram;
    }());
    function manhattanHeuristic(pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    }
    var AstarPathFinder = (function () {
        function AstarPathFinder() {
        }
        AstarPathFinder.prototype.findPath = function (sourceConnectionPoints, targetConnectionPoints, diagram) {
            var _this = this;
            var connectionPointCombinations = path_finder_1.cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);
            var shortestConnectionPointCombination = connectionPointCombinations.reduce(function (previousShortestConnectionPoints, currentConnectionPoints) {
                var previousPath = _this.findAPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1], diagram);
                var currentPath = _this.findAPath(currentConnectionPoints[0], currentConnectionPoints[1], diagram);
                var previousLength = path_finder_1.lengthOf(previousPath);
                var currentLength = path_finder_1.lengthOf(currentPath);
                var shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
                return shorterPath;
            });
            var path = this.findAPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1], diagram);
            return path;
        };
        AstarPathFinder.prototype.findAPath = function (sourcePoint, targetPoint, diagram) {
            var graph = new GraphForDiagram(diagram);
            var heuristic = manhattanHeuristic;
            var startNode = graph.getNode(sourcePoint);
            var endNode = graph.getNode(targetPoint);
            var openHeap = new binary_heap_1.BinaryHeap(function (n) { return n.fScore(endNode); });
            var closestNode = startNode;
            openHeap.push(startNode);
            var numTries = 0;
            while (openHeap.size > 0) {
                numTries++;
                var currentNode = openHeap.pop();
                if (currentNode === endNode) {
                    console.debug("It took " + numTries + " tries");
                    return graph.getFullPath(currentNode);
                }
                currentNode.closed = true;
                var neighborNodes = graph.getNeighbors(currentNode);
                for (var _i = 0, neighborNodes_1 = neighborNodes; _i < neighborNodes_1.length; _i++) {
                    var neighborNode = neighborNodes_1[_i];
                    if (neighborNode.closed)
                        continue;
                    var tentative_gScore = currentNode.gScore + graph.getCost(neighborNode, currentNode, currentNode.parent);
                    var neighborVisited = neighborNode.visited;
                    if (!neighborVisited || tentative_gScore < neighborNode.gScore) {
                        neighborNode.parent = currentNode;
                        neighborNode.gScore = tentative_gScore;
                        if (!neighborVisited) {
                            openHeap.push(neighborNode);
                        }
                        else {
                            openHeap.rescore(neighborNode);
                        }
                        neighborNode.visited = true;
                    }
                }
            }
        };
        return AstarPathFinder;
    }());
    exports.AstarPathFinder = AstarPathFinder;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('system-context-diagram/system-actor-edge',["require", "exports", "aurelia-framework", "../common/edge-base", "../common/astar-path-finder"], function (require, exports, aurelia_framework_1, edge_base_1, astar_path_finder_1) {
    "use strict";
    var SystemActorEdge = (function (_super) {
        __extends(SystemActorEdge, _super);
        function SystemActorEdge(pathFinder) {
            return _super.call(this, pathFinder) || this;
        }
        Object.defineProperty(SystemActorEdge.prototype, "svgPoints", {
            get: function () {
                var svgPath = this.path.map(function (p) { return p.x + "," + p.y; }).join(" ");
                return svgPath;
            },
            enumerable: true,
            configurable: true
        });
        SystemActorEdge.prototype.attached = function () {
            this.updatePath();
        };
        SystemActorEdge.prototype.updateFromModel = function (model) {
            this.id = model.id;
            this.name = model.name;
            this.description = model.description;
            this.sourceNode = this.parentDiagram.actorNodes.find(function (a) { return a.id === model.sourceNodeId; })
                || this.parentDiagram.systemNodes.find(function (s) { return s.id === model.sourceNodeId; });
            this.targetNode = this.parentDiagram.systemNodes.find(function (s) { return s.id === model.targetNodeId; })
                || this.parentDiagram.actorNodes.find(function (s) { return s.id === model.targetNodeId; });
        };
        SystemActorEdge.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.description = this.description;
            model.sourceNodeId = this.sourceNode.id;
            model.targetNodeId = this.targetNode.id;
            return model;
        };
        return SystemActorEdge;
    }(edge_base_1.EdgeBase));
    __decorate([
        aurelia_framework_1.computedFrom('path'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], SystemActorEdge.prototype, "svgPoints", null);
    SystemActorEdge = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [astar_path_finder_1.AstarPathFinder])
    ], SystemActorEdge);
    exports.SystemActorEdge = SystemActorEdge;
});

define('services/system-context-diagram-service',["require", "exports"], function (require, exports) {
    "use strict";
    var SystemContextDiagramService = (function () {
        function SystemContextDiagramService() {
            var systemNode1 = {
                id: "systemNode1",
                name: "System Node 1",
                x: 20,
                y: 20,
                width: 200,
                height: 200,
                containerDiagramId: "containerDiagram1"
            };
            var actorNode1 = {
                id: "actorNode1",
                name: "Actor Node 1",
                x: 400,
                y: 100,
                width: 200,
                height: 200
            };
            var externalSystem1 = {
                id: "externalSystemNode1",
                name: "External System Node 1",
                x: 20,
                y: 250,
                isExternalSystem: true,
                width: 200,
                height: 200
            };
            var edge1 = {
                id: 'systemActorEdge1',
                name: 'System Actor Edge 1',
                sourceNodeId: 'systemNode1',
                targetNodeId: 'actorNode1'
            };
            var diagram1 = {
                id: "systemContextDiagram1",
                name: "System Context Diagram 1",
                systemNodes: [systemNode1, externalSystem1],
                actorNodes: [actorNode1],
                edges: [edge1]
            };
            var diagram2 = {
                id: "systemContextDiagram2",
                name: "System Context Diagram 2",
                systemNodes: [],
                actorNodes: [],
                edges: []
            };
            this.diagrams = [diagram1, diagram2];
        }
        SystemContextDiagramService.prototype.getAll = function () {
            var _this = this;
            return new Promise(function (resolve) { return resolve(_this.diagrams); });
        };
        return SystemContextDiagramService;
    }());
    exports.SystemContextDiagramService = SystemContextDiagramService;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('system-context-diagram/system-context-diagram',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "./system-node", "./actor-node", "./system-actor-edge", "../common/diagram-base", "../services/system-context-diagram-service"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, system_node_1, actor_node_1, system_actor_edge_1, diagram_base_1, system_context_diagram_service_1) {
    "use strict";
    var SystemContextDiagram = (function (_super) {
        __extends(SystemContextDiagram, _super);
        function SystemContextDiagram(eventAggregator, router, container, systemContextDiagramService) {
            var _this = _super.call(this) || this;
            _this.eventAggregator = eventAggregator;
            _this.router = router;
            _this.container = container;
            _this.systemContextDiagramService = systemContextDiagramService;
            return _this;
        }
        SystemContextDiagram.prototype.attached = function () {
            this.attachHammerEventHandler(this.diagramElement);
        };
        SystemContextDiagram.prototype.activate = function (params) {
            var _this = this;
            this.systemContextDiagramService.getAll().then(function (diagrams) {
                var systemContextDiagramModel = diagrams.find(function (m) { return m.id === params.id; });
                if (!systemContextDiagramModel) {
                    _this.router.navigateToRoute('system-context-diagram', { 'id': diagrams[0].id });
                    return;
                }
                _this.updateFromModel(systemContextDiagramModel);
                _this.eventAggregator.publish("SystemContextDiagramModelChanged", systemContextDiagramModel);
            });
        };
        SystemContextDiagram.prototype.getNodes = function () {
            var nodes = this.systemNodes
                .concat(this.actorNodes);
            return nodes;
        };
        SystemContextDiagram.prototype.getEdges = function () {
            var edges = this.systemActorEdges;
            return edges;
        };
        SystemContextDiagram.prototype.updateFromModel = function (model) {
            var _this = this;
            this.id = model.id;
            this.name = model.name;
            this.actorNodes = model.actorNodes.map(function (nodeModel) {
                var node = _this.container.get(actor_node_1.ActorNode);
                node.updateFromModel(nodeModel);
                return node;
            });
            this.systemNodes = model.systemNodes.map(function (nodeModel) {
                var node = _this.container.get(system_node_1.SystemNode);
                node.updateFromModel(nodeModel);
                return node;
            });
            this.systemActorEdges = model.edges.map(function (edgeModel) {
                var connector = _this.container.get(system_actor_edge_1.SystemActorEdge);
                connector.parentDiagram = _this;
                connector.updateFromModel(edgeModel);
                return connector;
            });
        };
        SystemContextDiagram.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.actorNodes = this.actorNodes.map(function (node) { return node.copyToModel(); });
            model.systemNodes = this.systemNodes.map(function (node) { return node.copyToModel(); });
            model.edges = this.systemActorEdges.map(function (connector) { return connector.copyToModel(); });
            return model;
        };
        return SystemContextDiagram;
    }(diagram_base_1.DiagramBase));
    SystemContextDiagram = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
            aurelia_router_1.Router,
            aurelia_framework_1.Container,
            system_context_diagram_service_1.SystemContextDiagramService])
    ], SystemContextDiagram);
    exports.SystemContextDiagram = SystemContextDiagram;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('system-context-diagram/system-node',["require", "exports", "../common/node-base"], function (require, exports, node_base_1) {
    "use strict";
    var SystemNode = (function (_super) {
        __extends(SystemNode, _super);
        function SystemNode() {
            var _this = _super.call(this) || this;
            _this.isExternalSystem = false;
            _this.width = 200;
            _this.height = 200;
            return _this;
        }
        SystemNode.prototype.updateFromModel = function (model) {
            this.id = model.id;
            this.name = model.name;
            this.x = model.x;
            this.y = model.y;
            this.width = model.width;
            this.height = model.height;
            this.isExternalSystem = model.isExternalSystem;
            this.containerDiagramId = model.containerDiagramId;
        };
        SystemNode.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.x = this.x;
            model.y = this.y;
            model.width = this.width;
            model.height = this.height;
            model.isExternalSystem = this.isExternalSystem;
            model.containerDiagramId = this.containerDiagramId;
            return model;
        };
        return SystemNode;
    }(node_base_1.NodeBase));
    exports.SystemNode = SystemNode;
});

define('main',["require", "exports", "./system-context-diagram/system-node"], function (require, exports, system_node_1) {
    "use strict";
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .developmentLogging();
        aurelia.container.registerTransient(system_node_1.SystemNode);
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('services/container-diagram-service',["require", "exports"], function (require, exports) {
    "use strict";
    var ContainerDiagramService = (function () {
        function ContainerDiagramService() {
            var container1 = {
                id: "containerNode1",
                name: "Container Node 1",
                x: 10,
                y: 10,
                width: 200,
                height: 200,
                description: "Lorem ipsum dolor sit amet",
                componentDiagramId: "componentDiagram1"
            };
            var container2 = {
                id: "containerNode2",
                name: "Container Node 2",
                x: 200,
                y: 200,
                width: 200,
                height: 200,
                description: "Lorem ipsum dolor sit amet",
                componentDiagramId: 'componentDiagram1'
            };
            var diagram1 = {
                id: "containerDiagram1",
                name: "Container Diagram 1",
                containerNodes: [container1, container2]
            };
            var diagram2 = {
                id: "containerDiagram2",
                name: "Container Diagram 2",
                containerNodes: []
            };
            this.diagrams = [diagram1, diagram2];
        }
        ContainerDiagramService.prototype.getAll = function () {
            var _this = this;
            return new Promise(function (resolve) { return resolve(_this.diagrams); });
        };
        return ContainerDiagramService;
    }());
    exports.ContainerDiagramService = ContainerDiagramService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('nav-bar',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "./services/system-context-diagram-service", "./services/container-diagram-service"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, system_context_diagram_service_1, container_diagram_service_1) {
    "use strict";
    var NavBar = (function () {
        function NavBar(router, eventAggregator, systemContextDiagramService, containerDiagramService) {
            var _this = this;
            this.router = router;
            this.eventAggregator = eventAggregator;
            this.systemContextDiagramService = systemContextDiagramService;
            this.containerDiagramService = containerDiagramService;
            this.systemContextDiagrams = [];
            this.currentSystemContextDiagram = null;
            this.containerDiagrams = [];
            this.currentContainerDiagram = null;
            this.componentDiagrams = [];
            this.currentComponentDiagram = null;
            eventAggregator.subscribe("SystemContextDiagramModelChanged", function (model) {
                _this.currentSystemContextDiagram = model;
                _this.currentContainerDiagram = null;
                _this.currentComponentDiagram = null;
            });
            eventAggregator.subscribe("ContainerDiagramModelChanged", function (model) {
                _this.currentContainerDiagram = model;
                _this.currentComponentDiagram = null;
            });
            eventAggregator.subscribe("ComponentDiagramModelChanged", function (model) {
                _this.currentComponentDiagram = model;
            });
        }
        NavBar.prototype.attached = function () {
            var _this = this;
            this.systemContextDiagramService.getAll()
                .then(function (diagrams) {
                _this.systemContextDiagrams = diagrams;
            });
            this.containerDiagramService.getAll()
                .then(function (diagrams) {
                _this.containerDiagrams = diagrams;
            });
        };
        return NavBar;
    }());
    NavBar = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_router_1.Router,
            aurelia_event_aggregator_1.EventAggregator,
            system_context_diagram_service_1.SystemContextDiagramService,
            container_diagram_service_1.ContainerDiagramService])
    ], NavBar);
    exports.NavBar = NavBar;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('admin/admin',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../services/system-context-diagram-service"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, system_context_diagram_service_1) {
    "use strict";
    var Admin = (function () {
        function Admin(router, eventAggregator, systemContextDiagramService) {
            this.router = router;
            this.eventAggregator = eventAggregator;
            this.systemContextDiagramService = systemContextDiagramService;
        }
        Admin.prototype.activate = function () {
            this.loadSystemContextDiagrams();
            this.eventAggregator.publish("SystemContextDiagramModelChanged", null);
        };
        Admin.prototype.delete = function () {
            alert("Delete");
        };
        Admin.prototype.loadSystemContextDiagrams = function () {
            var _this = this;
            this.systemContextDiagramService.getAll()
                .then(function (diagrams) {
                _this.systemContextDiagrams = diagrams;
            });
        };
        return Admin;
    }());
    Admin = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_router_1.Router,
            aurelia_event_aggregator_1.EventAggregator,
            system_context_diagram_service_1.SystemContextDiagramService])
    ], Admin);
    exports.Admin = Admin;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('component-diagram/component-node',["require", "exports", "../common/node-base"], function (require, exports, node_base_1) {
    "use strict";
    var ComponentNode = (function (_super) {
        __extends(ComponentNode, _super);
        function ComponentNode() {
            var _this = _super.call(this) || this;
            _this.width = 200;
            _this.height = 200;
            return _this;
        }
        ComponentNode.prototype.updateFromModel = function (model) {
            this.id = model.id;
            this.name = model.name;
            this.x = model.x;
            this.y = model.y;
            this.width = model.width;
            this.height = model.height;
        };
        ComponentNode.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.x = this.x;
            model.y = this.y;
            model.width = this.width;
            model.height = this.height;
            return model;
        };
        return ComponentNode;
    }(node_base_1.NodeBase));
    exports.ComponentNode = ComponentNode;
});

define('services/component-diagram-service',["require", "exports"], function (require, exports) {
    "use strict";
    var ComponentDiagramService = (function () {
        function ComponentDiagramService() {
            var componentNode = {
                id: "componentNode1",
                name: "Component Node 1",
                x: 100,
                y: 100
            };
            var diagram = {
                id: "componentDiagram1",
                name: "Component Diagram 1",
                componentNodes: [componentNode]
            };
            this.diagrams = [diagram];
        }
        ComponentDiagramService.prototype.getAll = function () {
            var _this = this;
            return new Promise(function (resolve) { return resolve(_this.diagrams); });
        };
        return ComponentDiagramService;
    }());
    exports.ComponentDiagramService = ComponentDiagramService;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('component-diagram/component-diagram',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../common/diagram-base", "./component-node", "../services/system-context-diagram-service", "../services/container-diagram-service", "../services/component-diagram-service", "hammerjs"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, diagram_base_1, component_node_1, system_context_diagram_service_1, container_diagram_service_1, component_diagram_service_1) {
    "use strict";
    var ComponentDiagram = (function (_super) {
        __extends(ComponentDiagram, _super);
        function ComponentDiagram(eventAggregator, systemContextDiagramService, containerDiagramService, componentDiagramService) {
            var _this = _super.call(this) || this;
            _this.eventAggregator = eventAggregator;
            _this.systemContextDiagramService = systemContextDiagramService;
            _this.containerDiagramService = containerDiagramService;
            _this.componentDiagramService = componentDiagramService;
            return _this;
        }
        ComponentDiagram.prototype.activate = function (params) {
            var _this = this;
            this.systemContextDiagramService.getAll().then(function (diagrams) {
                var systemContextDiagramModel = diagrams.find(function (m) { return m.id === params.systemContextDiagramId; });
                _this.eventAggregator.publish('SystemContextDiagramModelChanged', systemContextDiagramModel);
            });
            this.containerDiagramService.getAll()
                .then(function (diagrams) {
                var containerDiagramModel = diagrams.find(function (m) { return m.id === params.containerDiagramId; });
                _this.eventAggregator.publish('ContainerDiagramModelChanged', containerDiagramModel);
            });
            this.componentDiagramService.getAll()
                .then(function (diagrams) {
                var componentDiagramModel = diagrams.find(function (m) { return m.id === params.id; });
                _this.updateFromModel(componentDiagramModel);
                _this.eventAggregator.publish('ComponentDiagramModelChanged', componentDiagramModel);
            });
        };
        ComponentDiagram.prototype.attached = function () {
            this.attachHammerEventHandler(this.diagramElement);
        };
        ComponentDiagram.prototype.getNodes = function () {
            var nodes = this.componentNodes;
            return nodes;
        };
        ComponentDiagram.prototype.getEdges = function () {
            return [];
        };
        ComponentDiagram.prototype.updateFromModel = function (model) {
            this.id = model.id;
            this.name = model.name;
            this.componentNodes = model.componentNodes.map(function (nodeModel) {
                var node = new component_node_1.ComponentNode();
                node.updateFromModel(nodeModel);
                return node;
            });
        };
        ComponentDiagram.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.componentNodes = this.componentNodes.map(function (node) { return node.copyToModel(); });
            return model;
        };
        return ComponentDiagram;
    }(diagram_base_1.DiagramBase));
    ComponentDiagram = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
            system_context_diagram_service_1.SystemContextDiagramService,
            container_diagram_service_1.ContainerDiagramService,
            component_diagram_service_1.ComponentDiagramService])
    ], ComponentDiagram);
    exports.ComponentDiagram = ComponentDiagram;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('container-diagram/container-node',["require", "exports", "../common/node-base"], function (require, exports, node_base_1) {
    "use strict";
    var ContainerNode = (function (_super) {
        __extends(ContainerNode, _super);
        function ContainerNode() {
            var _this = _super.call(this) || this;
            _this.width = 200;
            _this.height = 200;
            return _this;
        }
        ContainerNode.prototype.updateFromModel = function (model) {
            this.id = model.id;
            this.name = model.name;
            this.x = model.x;
            this.y = model.y;
            this.width = model.width;
            this.height = model.height;
            this.componentDiagramId = model.componentDiagramId;
        };
        ContainerNode.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.x = this.x;
            model.y = this.y;
            model.width = this.width;
            model.height = this.height;
            model.componentDiagramId = this.componentDiagramId;
            return model;
        };
        return ContainerNode;
    }(node_base_1.NodeBase));
    exports.ContainerNode = ContainerNode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('container-diagram/container-diagram',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../common/diagram-base", "./container-node", "../services/system-context-diagram-service", "../services/container-diagram-service", "hammerjs"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, diagram_base_1, container_node_1, system_context_diagram_service_1, container_diagram_service_1) {
    "use strict";
    var ContainerDiagram = (function (_super) {
        __extends(ContainerDiagram, _super);
        function ContainerDiagram(eventAggregator, systemContextDiagramService, containerDiagramService) {
            var _this = _super.call(this) || this;
            _this.eventAggregator = eventAggregator;
            _this.systemContextDiagramService = systemContextDiagramService;
            _this.containerDiagramService = containerDiagramService;
            return _this;
        }
        ;
        ContainerDiagram.prototype.activate = function (params) {
            var _this = this;
            this.systemContextDiagramService.getAll().then(function (diagrams) {
                var systemContextDiagramModel = diagrams.find(function (m) { return m.id === params.systemContextDiagramId; });
                _this.eventAggregator.publish("SystemContextDiagramModelChanged", systemContextDiagramModel);
            });
            this.containerDiagramService.getAll()
                .then(function (diagrams) {
                var containerDiagramModel = diagrams.find(function (m) { return m.id === params.id; });
                _this.updateFromModel(containerDiagramModel);
                _this.eventAggregator.publish("ContainerDiagramModelChanged", containerDiagramModel);
            });
        };
        ContainerDiagram.prototype.attached = function () {
            this.attachHammerEventHandler(this.diagramElement);
        };
        ContainerDiagram.prototype.getNodes = function () {
            var nodes = this.containerNodes;
            return nodes;
        };
        ContainerDiagram.prototype.getEdges = function () {
            return [];
        };
        ContainerDiagram.prototype.updateFromModel = function (model) {
            this.id = model.id;
            this.name = model.name;
            this.containerNodes = model.containerNodes.map(function (nodeModel) {
                var node = new container_node_1.ContainerNode();
                node.updateFromModel(nodeModel);
                return node;
            });
        };
        ContainerDiagram.prototype.copyToModel = function () {
            var model = {};
            model.id = this.id;
            model.name = this.name;
            model.containerNodes = this.containerNodes.map(function (node) { return node.copyToModel(); });
            return model;
        };
        return ContainerDiagram;
    }(diagram_base_1.DiagramBase));
    ContainerDiagram = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
            system_context_diagram_service_1.SystemContextDiagramService,
            container_diagram_service_1.ContainerDiagramService])
    ], ContainerDiagram);
    exports.ContainerDiagram = ContainerDiagram;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\r\n  <require from=\"./app.css\"></require>\r\n\r\n  <require from=\"./nav-bar\"></require>\r\n\r\n  <nav-bar></nav-bar>\r\n\r\n  <div class=\"page-host\">\r\n    <router-view></router-view>\r\n  </div>\r\n</template>\r\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template>\r\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\r\n        <span class=\"sr-only\">Toggle Navigation</span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n      </button>\r\n      <a class=\"navbar-brand\" href=\"#\">\r\n        <i class=\"fa fa-home\"></i>\r\n        <span>${router.title}</span>\r\n      </a>\r\n    </div>\r\n\r\n    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\r\n      <ul class=\"nav navbar-nav\">\r\n        <li if.bind=\"currentSystemContextDiagram\" class=\"dropdown\">\r\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n              ${currentSystemContextDiagram.name} <span class=\"caret\"></span>\r\n          </a>\r\n          <ul class=\"dropdown-menu\">\r\n            <li repeat.for=\"diagram of systemContextDiagrams\">\r\n                <a route-href=\"route: system-context-diagram; params.bind: {id: diagram.id}\"\">${diagram.name}</a>\r\n            </li>\r\n          </ul>\r\n        </li>\r\n        \r\n        <li if.bind=\"currentContainerDiagram\" class=\"dropdown\">\r\n            <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n                ${currentContainerDiagram.name} <span class=\"caret\"></span>\r\n            </a>\r\n            <ul class=\"dropdown-menu\">\r\n                <li repeat.for=\"diagram of containerDiagrams\">\r\n                    <a route-href=\"route: container-diagram; params.bind: {id: diagram.id}\"\">${diagram.name}</a>\r\n                </li>\r\n            </ul>\r\n        </li>\r\n        \r\n        <li if.bind=\"currentComponentDiagram\" class=\"dropdown\">\r\n            <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n                ${currentComponentDiagram.name} <span class=\"caret\"></span>\r\n            </a>\r\n            <ul class=\"dropdown-menu\">\r\n                <li repeat.for=\"diagram of componentDiagrams\">\r\n                    <a route-href=\"route: component-diagram; params.bind: {id: diagram.id}\"\">${diagram.name}</a>\r\n                </li>\r\n            </ul>\r\n        </li>\r\n      </ul>\r\n\r\n      <ul class=\"nav navbar-nav navbar-right\">\r\n        <li class=\"loader\" if.bind=\"router.isNavigating\">\r\n          <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\r\n        </li>\r\n        \r\n        <li>\r\n            <a route-href=\"route: admin\" title=\"Admin\">\r\n                <i class=\"fa fa-wrench\" aria-hidden=\"true\"></i>\r\n            </a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </nav>\r\n</template>\r\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "html {\n  height: 100%;\n}\nbody {\n  margin: 0;\n  height: 100%;\n}\n.page-host {\n  height: calc(100% - 68px);\n}\n.page-host router-view {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n"; });
define('text!admin/admin.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./admin.css\"></require>\r\n    \r\n    <section class=\"admin\">\r\n        <table>\r\n            <thead>\r\n                <tr>\r\n                    <td>System</td>\r\n                    <td></td>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr repeat.for=\"diagram of systemContextDiagrams\">\r\n                    <td>\r\n                        <a route-href=\"route: system-context-diagram; params.bind: {id: diagram.id}\">\r\n                            ${diagram.name}\r\n                        </a>\r\n                    </td>\r\n                    <td>\r\n                        <i class=\"fa fa-trash\" aria-hidden=\"true\" click.trigger=\"delete()\"></i>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </section>\r\n</template>\r\n"; });
define('text!admin/admin.css', ['module'], function(module) { module.exports = ".admin table {\n  width: 90%;\n}\n.admin table thead tr td {\n  padding: 10px;\n}\n.admin table tbody tr td {\n  padding: 10px;\n}\n"; });
define('text!common/selection-box.html', ['module'], function(module) { module.exports = "<template>\r\n    <svg x.bind=\"x\" y.bind=\"y\" \r\n         width.bind=\"width\" height.bind=\"height\"\r\n         viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\">\r\n        <rect x=\"0\" y=\"0\" width=\"99\" height=\"99\" \r\n              rx=\"1\" ry=\"1\" fill=\"grey\" stroke=\"grey\"\r\n              fill-opacity=\"0.1\" stroke-opacity=\"0.9\" />\r\n    </svg>\r\n</template>\r\n"; });
define('text!common/node-base.css', ['module'], function(module) { module.exports = "svg.node-base rect {\n  fill: grey;\n  stroke: grey;\n  stroke-opacity: 0.9;\n  stroke-width: 1;\n}\nsvg.node-base.selected rect {\n  stroke-width: 3;\n}\n"; });
define('text!component-diagram/component-diagram.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./component-diagram.css\"></require>\r\n    \r\n    <section class=\"component-diagram col s12\">\r\n        <h2>Component Diagram</h2>\r\n        \r\n        <svg class=\"diagram\" element.ref=\"diagramElement\">\r\n            <svg repeat.for=\"componentNode of componentNodes\" >\r\n                <compose view-model.bind=\"componentNode\" containerless></compose>\r\n            </svg>\r\n            \r\n            <compose view-model.bind=\"selectionBox\" containerless></compose>\r\n        </svg>\r\n    </section>\r\n</template>\r\n"; });
define('text!component-diagram/component-diagram.css', ['module'], function(module) { module.exports = "section.component-diagram {\n  height: 100%;\n  cursor: default;\n}\nsection.component-diagram svg.diagram {\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n"; });
define('text!component-diagram/component-node.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../common/node-base.css\"></require>\r\n\r\n    <svg x.bind=\"x\" y.bind=\"y\"\r\n         width.bind=\"width\" height.bind=\"height\"\r\n         viewBox=\"0 0 100 100\"\r\n         class=\"node-base ${isSelected ? 'selected' : ''}\">\r\n        <rect class=\"outline\"\r\n              x=\"5\" y=\"5\" width=\"90\" height=\"90\"\r\n              rx=\"1\" ry=\"1\" />\r\n        <text x=\"8\" y=\"15\" font-size=\"8\">\r\n            ${name}\r\n        </text>\r\n        <foreignObject requiredFeatures=\"http://www.w3.org/TR/SVG11/feature#Extensibility\"\r\n                       x=\"8\" y=\"20\" width=\"80\" height=\"80\">\r\n            <div style=\"height: 70px; font-size: 8px; overflow: hidden\">\r\n                ${description}\r\n            </div>\r\n        </foreignObject>\r\n    </svg>\r\n</template>\r\n"; });
define('text!component-diagram/component-node.css', ['module'], function(module) { module.exports = "svg.component-node rect {\n  fill: orange;\n}\nsvg.component-node.external rect {\n  fill: red;\n}\n"; });
define('text!container-diagram/container-diagram.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./container-diagram.css\"></require>\r\n    \r\n    <section class=\"container-diagram col s12\">\r\n        <h2>Container Diagram</h2>\r\n        \r\n        <svg class=\"diagram\" element.ref=\"diagramElement\">\r\n            <svg repeat.for=\"containerNode of containerNodes\" >\r\n                <compose view-model.bind=\"containerNode\" containerless></compose>\r\n            </svg>\r\n            \r\n            <compose view-model.bind=\"selectionBox\" containerless></compose>\r\n        </svg>\r\n    </section>\r\n</template>\r\n"; });
define('text!container-diagram/container-diagram.css', ['module'], function(module) { module.exports = "section.container-diagram {\n  height: 100%;\n  cursor: default;\n}\nsection.container-diagram svg.diagram {\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n"; });
define('text!container-diagram/container-node.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../common/node-base.css\"></require>\r\n    \r\n    <svg x.bind=\"x\" y.bind=\"y\" \r\n         width.bind=\"width\" height.bind=\"height\" \r\n         viewBox=\"0 0 100 100\"\r\n         class=\"node-base ${isSelected ? 'selected' : ''}\">\r\n        <rect\r\n            class=\"outline\" \r\n            x=\"5\" y=\"5\" width=\"90\" height=\"90\"\r\n            rx=\"1\" ry=\"1\" />\r\n        <text x=\"8\" y=\"15\" font-size=\"8\">\r\n            ${name}\r\n        </text>\r\n        <foreignObject requiredFeatures=\"http://www.w3.org/TR/SVG11/feature#Extensibility\"\r\n                        x=\"8\" y=\"20\" width=\"80\" height=\"80\">\r\n            <div style=\"height: 70px; font-size: 8px; overflow: hidden\">\r\n                ${description}\r\n                <a route-href=\"route: component-diagram; params.bind: {id: componentDiagramId}\">open component diagram</a>\r\n            </div>\r\n        </foreignObject>\r\n    </svg>\r\n</template>\r\n"; });
define('text!system-context-diagram/actor-node.css', ['module'], function(module) { module.exports = "svg.actor-node rect {\n  fill: green;\n}\n"; });
define('text!system-context-diagram/actor-node.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../common/node-base.css\"></require>\r\n    <require from=\"./actor-node.css\"></require>\r\n    \r\n    <svg x.bind=\"x\" y.bind=\"y\" \r\n         width.bind=\"width\" height.bind=\"height\" \r\n         viewBox=\"0 0 100 100\"\r\n         class=\"node-base actor-node ${isSelected ? 'selected' : ''}\">\r\n        <rect\r\n            x=\"5\" y=\"5\" width=\"90\" height=\"90\"\r\n            rx=\"1\" ry=\"1\" />\r\n        <text x=\"8\" y=\"15\" font-size=\"8\">\r\n            ${name}\r\n        </text>\r\n        <foreignObject requiredFeatures=\"http://www.w3.org/TR/SVG11/feature#Extensibility\"\r\n                        x=\"8\" y=\"20\" width=\"80\" height=\"80\">\r\n            <div style=\"height: 70px; font-size: 8px; overflow: hidden\">\r\n                ${description}\r\n            </div>\r\n        </foreignObject>\r\n    </svg>\r\n</template>\r\n"; });
define('text!system-context-diagram/system-context-diagram.css', ['module'], function(module) { module.exports = "section.system-context-diagram {\n  height: 100%;\n  cursor: default;\n}\nsection.system-context-diagram svg.diagram {\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n"; });
define('text!system-context-diagram/system-node.css', ['module'], function(module) { module.exports = "svg.system-node rect {\n  fill: orange;\n}\nsvg.system-node.external rect {\n  fill: red;\n}\n"; });
define('text!system-context-diagram/system-actor-edge.html', ['module'], function(module) { module.exports = "<template>\r\n    <svg>\r\n        <defs>\r\n            <marker id=\"arrowHead\"\r\n                    viewBox=\"0 0 10 10\" \r\n                    refX=\"1\" refY=\"5\"\r\n                    markerWidth=\"6\" \r\n                    markerHeight=\"6\"\r\n                    orient=\"auto\">\r\n                <path d=\"M 0 0 L 10 5 L 0 10 z\" />\r\n            </marker>\r\n        </defs>\r\n        \r\n        <polyline points.bind=\"svgPoints\" \r\n            fill=\"none\" stroke=\"black\" stroke-width=\"2\"\r\n            marker-end=\"url(#arrowHead)\" stroke-linejoin=\"round\"/>\r\n    </svg>\r\n</template>"; });
define('text!system-context-diagram/system-context-diagram.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./system-context-diagram.css\"></require>\r\n    <require from=\"./system-node\"></require>\r\n    \r\n    <section class=\"system-context-diagram col s12\">\r\n    \r\n        <svg class=\"diagram\" element.ref=\"diagramElement\">\r\n            <svg repeat.for=\"systemNode of systemNodes\">\r\n                <compose view-model.bind=\"systemNode\" containerless></compose>\r\n            </svg>\r\n            <svg repeat.for=\"actorNode of actorNodes\">\r\n                <compose view-model.bind=\"actorNode\" containerless></compose>\r\n            </svg>\r\n            <svg repeat.for=\"systemActorEdge of systemActorEdges\">\r\n                <compose view-model.bind=\"systemActorEdge\" containerless></compose>\r\n            </svg>\r\n            \r\n            <compose view-model.bind=\"selectionBox\" containerless></compose>\r\n        </svg>\r\n    \r\n    </section>\r\n</template>\r\n"; });
define('text!system-context-diagram/system-node.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../common/node-base.css\"></require>\r\n    <require from=\"./system-node.css\"></require>\r\n    \r\n    <svg x.bind=\"x\" y.bind=\"y\" \r\n         width.bind=\"width\" height.bind=\"height\" \r\n         viewBox=\"0 0 100 100\"\r\n         class=\"node-base system-node ${isExternalSystem ? 'external' : ''} \r\n                ${isSelected ? 'selected' : ''}\">\r\n        <rect\r\n            x=\"0\" y=\"0\" width=\"100\" height=\"100\"\r\n            rx=\"3\" ry=\"3\" />\r\n        <text x=\"8\" y=\"15\" font-size=\"8\">\r\n            ${name}\r\n        </text>\r\n        <foreignObject requiredFeatures=\"http://www.w3.org/TR/SVG11/feature#Extensibility\"\r\n                        x=\"8\" y=\"20\" width=\"80\" height=\"80\">\r\n            <div style=\"height: 70px; font-size: 8px; overflow: hidden\">\r\n                ${description}\r\n                <a if.bind=\"!isExternalSystem\" route-href=\"route: container-diagram; params.bind: {id: containerDiagramId}\">open container diagram</a>\r\n            </div>\r\n        </foreignObject>\r\n    </svg>\r\n</template>\r\n"; });
//# sourceMappingURL=app-bundle.js.map