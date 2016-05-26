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
    
    constructor(point: Point) {
        this.x = point.x;
        this.y = point.y;
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
        
        const node = this.grid[this.toGrid(y)][this.toGrid(x)];
        return node;
    }
    
    getCost(point: Point): number {
        const nodes = this.diagram.getNodes();
        for (var node of nodes) {
            const diagramNodeX = node.x + this.diagramBoundingBox.x;
            const diagramNodeY = node.y + this.diagramBoundingBox.y;
            
            if (node.isHit(diagramNodeX, diagramNodeY))
                return 1000; // Wall
        }
        return 1; // cheapest
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
    
    private toGrid(value: number) {
        if (value % gridSpacing !== 0)
            throw `{value} is not within the grid`;

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
                row.push(node);
            }
            this.grid.push(row);
        }
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
                 
        // const connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

        // const shortestConnectionPointCombination = connectionPointCombinations.reduce((previousShortestConnectionPoints, currentConnectionPoints) => {
        //     const previousPath = this.findAPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1], diagram);
        //     const currentPath = this.findAPath(currentConnectionPoints[0], currentConnectionPoints[1], diagram);
            
        //     const previousLength = lengthOf(previousPath);
        //     const currentLength = lengthOf(currentPath);
            
        //     const shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
        //     return shorterPath;
        // });
        
        //const path = this.findAPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1], diagram);
        
        const sourceConnectionPoint = sourceConnectionPoints[0];
        const targetConnectionPoint = targetConnectionPoints[0];
        
        const path = this.findAPath(sourceConnectionPoint, targetConnectionPoint, diagram);
        
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
        
        while (openHeap.size > 0) {
            let currentNode = openHeap.pop();
            
            if (currentNode === endNode) {
                return graph.getFullPath(currentNode);
            }
            currentNode.closed = true;
            
            const neighbors = graph.getNeighbors(currentNode);
            
            for (let neighbor of neighbors) {
                if (neighbor.closed)
                    continue;
                
                const tentative_gScore = currentNode.gScore + graph.getCost(neighbor);
                const neighborVisited = neighbor.visited;

                if (!neighborVisited || tentative_gScore < neighbor.gScore) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.parent = currentNode;
                    neighbor.gScore = tentative_gScore;
                    
                    if (!neighborVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescore(neighbor);
                    }
                    
                    neighbor.visited = true;
                }
            }
        }
        
        // TODO: error
    }

}