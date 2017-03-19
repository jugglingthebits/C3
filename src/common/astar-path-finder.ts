import { LogManager } from 'aurelia-framework';
import { PathFinder, cartesianProduct, lengthOf } from './path-finder';
import { Point } from './edge-base';
import { BinaryHeap } from './binary-heap';
import { DiagramBase, BoundingBox } from './diagram-base';
import { Node, GraphForDiagram, manhattanHeuristic } from "./graph-for-diagram";

const logger = LogManager.getLogger('astar');

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
        logger.info(`Using connection points [${shortestConnectionPointCombination[0].x},${shortestConnectionPointCombination[0].y}] and [${shortestConnectionPointCombination[1].x},${shortestConnectionPointCombination[1].y}]`);

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
                //console.debug("It took " +  numTries + " tries");
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