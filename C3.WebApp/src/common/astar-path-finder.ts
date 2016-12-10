import {LogManager} from 'aurelia-framework';
import {PathFinder, cartesianProduct, lengthOf} from './path-finder';
import {Point} from './edge-base';
import {BinaryHeap} from './binary-heap';
import {DiagramBase, BoundingBox} from './diagram-base';

const logger = LogManager.getLogger('astar');
const gridSpacing = 10;

class Node implements Point {
    x: number;
    y: number;
    visited = false;
    closed: boolean = false;
    parent: Node;
    gScore = 0;
    isOccupied = false
    
    constructor(point: Point) {
        this.x = point.x;
        this.y = point.y;
    }
    
    fScore(endNode: Node): number {
        const fScore = this.gScore + this.hScore(endNode);
        return fScore;
    };
    
    private _hScore;
    private hScore(endNode: Node): number {
        if (!this._hScore)
            this._hScore = manhattanHeuristic(this, endNode);
        return this._hScore;
    }
}

class GraphForDiagram {
    // TODO: It would probably be much more efficient to use a sparse matrix 
    private grid: Node[][];
    private diagramBoundingBox: BoundingBox;
    
    constructor(private diagram: DiagramBase) {
        this.diagramBoundingBox = this.diagram.getBoundingBox();
        this.buildGrid();
    }
    
    getNode(point: Point): Node {
        const x = point.x - this.diagramBoundingBox.x;
        const y = point.y - this.diagramBoundingBox.y;
        
        const gridY = this.toGrid(y);
        const gridX = this.toGrid(x);
        const node = this.grid[gridY][gridX];
        return node;
    }
    
    getCost(node: Node, previousNode: Node, penultimateNode: Node): number {
        // Does the node intersect with a different node?
        if (node.isOccupied) {
            return 1000;
        }
        
        // Is the node in line with the last ones?
        if (!previousNode || !penultimateNode
         || node.x === previousNode.x && previousNode.x === penultimateNode.x 
         || node.y === previousNode.y && previousNode.y === penultimateNode.y )
            return 1;
        
        // Take a turn.
        return 10;
    }
    
    getFullPath(endNode: Node): Point[] {
        let currentNode = endNode;
        const path: Point[] = [];
        while (currentNode.parent) {
            const point = <Point>{x: currentNode.x + this.diagramBoundingBox.x, 
                                  y: currentNode.y + this.diagramBoundingBox.y};
            
            path.unshift(point);
            currentNode = currentNode.parent;
        }
        return path;
    }
    
    private toGrid(value: number): number {
        if (value % gridSpacing !== 0)
            //throw `{value} is not within the grid`;
            value = value - value % gridSpacing; // TODO: Use round of something more clever.

        return value/gridSpacing;
    }
    
    getNeighbors(node: Node): Node[] {
        if (this.diagramBoundingBox.width === 0 || this.diagramBoundingBox.height === 0)
            return [];
        
        let neighbors: Node[] = [];
        
        if (node.x > 0) {
            const leftNeighbor = this.grid[this.toGrid(node.y)][this.toGrid(node.x) - 1];
            neighbors.push(leftNeighbor);
        }
        if (node.x < this.diagramBoundingBox.width - 1) {
            const rightNeighbor = this.grid[this.toGrid(node.y)][this.toGrid(node.x) + 1];
            neighbors.push(rightNeighbor);
        }
        if (node.y > 0) {
            const topNeighbor = this.grid[this.toGrid(node.y) - 1][this.toGrid(node.x)];
            neighbors.push(topNeighbor);
        }
        if (node.y < this.diagramBoundingBox.height - 1) {
            const bottomNeighbor = this.grid[this.toGrid(node.y) + 1][this.toGrid(node.x)];
            neighbors.push(bottomNeighbor);
        }
        return neighbors;
    }
    
    private buildGrid() {
        this.grid = [];
        for (var i=0; i <= this.diagramBoundingBox.height; i=i+gridSpacing) {
            let row = [];
            for (var j=0; j <= this.diagramBoundingBox.width; j=j+gridSpacing) {
                const node = new Node({x: j, y: i});

                node.isOccupied = this.isDiagramNodeHit(node);

                row.push(node);
            }
            this.grid.push(row);
        }
    }

    private isDiagramNodeHit(node: Node) {
        const diagramX = node.x + this.diagramBoundingBox.x;
        const diagramY = node.y + this.diagramBoundingBox.y;

        const diagramNodes = this.diagram.getNodes();
        for (var diagramNode of diagramNodes) {
            if (diagramNode.isHit(diagramX, diagramY))
                return true;
        }
        return false;
    }
}

function manhattanHeuristic(pos0: Point, pos1: Point): number {
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
}

// Code adapted from https://github.com/bgrins/javascript-astar/blob/master/astar.js
export class AstarPathFinder implements PathFinder {
    findPath(sourceConnectionPoints: Point[], 
             targetConnectionPoints: Point[], diagram: DiagramBase): Point[] {
                 
        const connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

        const shortestConnectionPointCombination = connectionPointCombinations.reduce((previousShortestConnectionPoints, currentConnectionPoints) => {
            const previousPath = this.findAPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1], diagram);
            const currentPath = this.findAPath(currentConnectionPoints[0], currentConnectionPoints[1], diagram);
            
            const previousLength = lengthOf(previousPath);
            const currentLength = lengthOf(currentPath);
            
            const shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
            return shorterPath;
        });
        
        const path = this.findAPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1], diagram);
        
        return path;
    }
    
    private findAPath(sourcePoint: Point, targetPoint: Point, diagram: DiagramBase): Point[] {
        const graph = new GraphForDiagram(diagram);
        const heuristic = manhattanHeuristic;
        
        const startNode = graph.getNode(sourcePoint);
        const endNode = graph.getNode(targetPoint); 
        const openHeap = new BinaryHeap<Node>(n => n.fScore(endNode));
        let closestNode = startNode;
        
        // startNode.h = heuristic(sourcePoint, targetPoint);
        
        openHeap.push(startNode);
        
        let numTries = 0;

        while (openHeap.size > 0) {
            numTries++;
            let currentNode = openHeap.pop();
            
            if (currentNode === endNode) {
                console.debug("It took " +  numTries + " tries");
                return graph.getFullPath(currentNode);
            }
            currentNode.closed = true;
            
            const neighborNodes = graph.getNeighbors(currentNode);
            
            for (let neighborNode of neighborNodes) {
                if (neighborNode.closed)
                    continue;
                
                const tentative_gScore = currentNode.gScore + graph.getCost(neighborNode, currentNode, currentNode.parent);
                const neighborVisited = neighborNode.visited;

                if (!neighborVisited || tentative_gScore < neighborNode.gScore) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighborNode.parent = currentNode;
                    neighborNode.gScore = tentative_gScore;
                    
                    if (!neighborVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighborNode);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescore(neighborNode);
                    }
                    
                    neighborNode.visited = true;
                }
            }
        }
        
        // TODO: error
    }

}