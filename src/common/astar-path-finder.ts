import { LogManager } from 'aurelia-framework';
import { PathFinder, cartesianProduct, lengthOf } from './path-finder';
import { Point } from './edge-base';
import { BinaryHeap } from './binary-heap';
import { DiagramBase, BoundingBox } from './diagram-base';
import { Node, GraphForDiagram } from "./graph-for-diagram";

const logger = LogManager.getLogger('astar');

// Code adapted from https://github.com/bgrins/javascript-astar/blob/master/astar.js
export class AstarPathFinder implements PathFinder {
    private diagram: DiagramBase = null;
    private graph: GraphForDiagram = null;

    findShortestPath(sourceConnectionPoints: Point[],
        targetConnectionPoints: Point[], diagram: DiagramBase): Point[] {

        const connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

        const shortestConnectionPointCombination = connectionPointCombinations.reduce((previousShortestConnectionPoints, currentConnectionPoints) => {
            const previousPath = this.findPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1], diagram);
            const currentPath = this.findPath(currentConnectionPoints[0], currentConnectionPoints[1], diagram);

            const previousLength = lengthOf(previousPath);
            const currentLength = lengthOf(currentPath);

            const shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
            return shorterPath;
        });
        logger.info(`Using connection points [${shortestConnectionPointCombination[0].x},${shortestConnectionPointCombination[0].y}] and [${shortestConnectionPointCombination[1].x},${shortestConnectionPointCombination[1].y}]`);

        const path = this.findPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1], diagram);
        return path;
    }

    private findPath(sourcePoint: Point, targetPoint: Point, diagram: DiagramBase): Point[] {
        if (diagram !== this.diagram) {
            this.diagram = diagram;
            this.graph = null;
        }
        if (this.graph) {
            this.graph.reset();
        } else {
            this.graph = new GraphForDiagram(diagram);
        }

        const startNode = this.graph.getNode(sourcePoint);
        const endNode = this.graph.getNode(targetPoint);
        const openHeap = new BinaryHeap<Node>(n => n.fScore(endNode));
        let closestNode = startNode;

        openHeap.push(startNode);

        let numTries = 0;

        while (openHeap.size > 0) {
            numTries++;
            let currentNode = openHeap.pop();

            if (currentNode === endNode) {
                //console.debug("It took " +  numTries + " tries");
                return this.getFullPath(currentNode, diagram);
            }
            currentNode.closed = true;

            const neighborNodes = this.graph.getNeighbors(currentNode);

            for (let neighborNode of neighborNodes) {
                if (neighborNode.closed)
                    continue;

                const tentative_gScore = currentNode.gScore + this.getCost(neighborNode, currentNode, currentNode.parent);
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
        throw ("No path found");
    }

    private getCost(node: Node, previousNode: Node, penultimateNode: Node): number {
        // Does the node intersect with a different node?
        if (node.isOccupied) {
            return 1000;
        }

        // Is the node in line with the last ones?
        if (!previousNode || !penultimateNode
            || node.x === previousNode.x && previousNode.x === penultimateNode.x
            || node.y === previousNode.y && previousNode.y === penultimateNode.y)
            return 1;

        // Take a turn.
        return 10;
    }

    private getFullPath(endNode: Node, diagram: DiagramBase): Point[] {
        const diagramBoundingBox = diagram.getBoundingBox();

        let currentNode = endNode;
        const path: Point[] = [];
        while (currentNode.parent) {
            const point = <Point>{
                x: currentNode.x + diagramBoundingBox.x,
                y: currentNode.y + diagramBoundingBox.y
            };

            path.unshift(point);
            currentNode = currentNode.parent;
        }
        const point = <Point>{
            x: currentNode.x + diagramBoundingBox.x,
            y: currentNode.y + diagramBoundingBox.y
        };

        path.unshift(point);
        return path;
    }
}