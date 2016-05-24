import {PathFinder, cartesianProduct, lengthOf} from './path-finder';
import {Point} from './edge-base';
import {BinaryHeap} from './binary-heap';
import {DiagramBase} from './diagram-base';

interface Node extends Point {
    weight: number;
    g: number;
    h: number;
    f: number;
    visited: boolean;
    closed: boolean;
    parent: Node;
}

class GraphForDiagram {
    constructor(private diagram: DiagramBase) {}
    
    getCost(point: Node): number {
        return 0; // TODO
    }
    
    getNeighbors(node: Node): Node[] {
        return []; // TODO
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
        const openHeap = new BinaryHeap<Node>(n => graph.getCost(n));
        const heuristic = manhattanHeuristic;
        
        const startNode = <Node>sourcePoint;
        const endNode = <Node>targetPoint; 
        let closestNode = startNode;
        
        startNode.h = heuristic(sourcePoint, targetPoint);
        
        openHeap.push(startNode);
        
        while (openHeap.size > 0) {
            let currentNode = openHeap.pop();
            
            if (currentNode === endNode) {
                return pathTo(currentNode);
            }
            currentNode.closed = true;
            
            const neighbors = graph.getNeighbors(currentNode);
            
            for (let neighbor of neighbors) {
                if (neighbor.closed)
                    continue;
                
                const gScore = currentNode.g + neighbor.weight;
                const beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, endNode);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    
                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescore(neighbor);
                    }
                }
            }
        }
        
        return [];
    }

}