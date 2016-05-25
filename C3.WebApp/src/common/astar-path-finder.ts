import {PathFinder, cartesianProduct, lengthOf} from './path-finder';
import {Point} from './edge-base';
import {BinaryHeap} from './binary-heap';
import {DiagramBase, BoundingBox} from './diagram-base';

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
    // TODO: It would be much more efficient to use a sparse matrix 
    private grid: Node[][];
    private diagramBoundingBox: BoundingBox;
    
    constructor(private diagram: DiagramBase) {
        this.diagramBoundingBox = this.diagram.getBoundingBox();
        this.buildGrid();
    }
    
    getCost(point: Node): number {
        return 0; // TODO
    }
    
    getNeighbors(x: number, y: number): Node[] {
        if (this.diagramBoundingBox.width === 0 || this.diagramBoundingBox.height === 0)
            return [];
        
        let neighbors: Node[] = [];
        const gridX = x - this.diagramBoundingBox.x;
        const gridY = y - this.diagramBoundingBox.y;
        
        if (gridX > 0) {
            const leftNeighbor = this.grid[gridY][gridX - 1];
            neighbors.push(leftNeighbor);
        }
        if (gridX < this.diagramBoundingBox.width - 1) {
            const rightNeighbor = this.grid[gridY][gridX + 1];
            neighbors.push(rightNeighbor);
        }
        if (gridY > 0) {
            const topNeighbor = this.grid[gridY - 1][gridX];
            neighbors.push(topNeighbor);
        }
        if (gridY < this.diagramBoundingBox.height - 1) {
            const rightNeighbor = this.grid[gridY - 1][gridX];
            neighbors.push(rightNeighbor);
        }
    }
    
    private buildGrid() {
        this.grid = [];
        for (var i=0; i < this.diagramBoundingBox.height; i++) {
            let row = [];
            for (var j=0; j < this.diagramBoundingBox.width; j++) {
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

function pathTo(node: Node): Node[] {
    let currentNode = node;
    let path: Node[] = [];
    while (currentNode.parent) {
        path.unshift(currentNode);
        currentNode = currentNode.parent;
    }
    return path;
}

// Code adapted from https://github.com/bgrins/javascript-astar/blob/master/astar.js
export class AstarPathFinder implements PathFinder {
    constructor(private diagram: DiagramBase) {}
    
    findPath(sourceConnectionPoints: Point[], 
             targetConnectionPoints: Point[]): Point[] {
                 
        const connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

        const shortestConnectionPointCombination = connectionPointCombinations.reduce((previousShortestConnectionPoints, currentConnectionPoints) => {
            const previousPath = this.findAPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1]);
            const currentPath = this.findAPath(currentConnectionPoints[0], currentConnectionPoints[1]);
            
            const previousLength = lengthOf(previousPath);
            const currentLength = lengthOf(currentPath);
            
            const shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
            return shorterPath;
        });
        
        const path = this.findAPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1]);
        return path;
    }
    
    private findAPath(sourcePoint: Point, targetPoint: Point): Point[] {
        const graph = new GraphForDiagram(this.diagram);
        const heuristic = manhattanHeuristic;
        
        const startNode = new Node(sourcePoint);
        const endNode = new Node(targetPoint); 
        const openHeap = new BinaryHeap<Node>(n => n.fScore(endNode));
        let closestNode = startNode;
        
        // startNode.h = heuristic(sourcePoint, targetPoint);
        
        openHeap.push(startNode);
        
        while (openHeap.size > 0) {
            let currentNode = openHeap.pop();
            
            if (currentNode === endNode) {
                return pathTo(currentNode);
            }
            currentNode.closed = true;
            
            const neighbors = graph.getNeighbors(currentNode.x, currentNode.y);
            
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