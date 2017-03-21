import {NodeBase} from './node-base';
import {PathFinder} from './path-finder';
import { DiagramBase } from './diagram-base';
import { LogManager } from "aurelia-framework";

const logger = LogManager.getLogger('EdgeBase');

export interface Point {
    x: number;
    y: number;
}

export abstract class EdgeBase {
    path: Point[] = [];
    sourceNode: NodeBase;
    targetNode: NodeBase;
    parentDiagram: DiagramBase;
    
    constructor(private pathFinder: PathFinder) {}

    updatePath() {
        if (this.areNodesOverlapping())
            return;        
 
        const sourceConnectionPoints = this.sourceNode.getConnectionPoints();
        const targetConnectionPoints = this.targetNode.getConnectionPoints();

        logger.info(`Searching for path between ${this.sourceNode.id} and ${this.targetNode.id}.`);
        this.path = this.pathFinder.findShortestPath(sourceConnectionPoints, targetConnectionPoints, this.parentDiagram);
        logger.info("Found path: ", this.path.reduce((prev, current) => prev + `[${current.x},${current.y}];`, ""));
    }
    
    isHit(x: number, y: number): boolean {
        let hit = this.path.some(p => p.x === x && p.y === y);
        return hit;
    }

    private areNodesOverlapping(): boolean {
        const overlapping = 
               this.sourceNode.x + this.sourceNode.width > this.targetNode.x
            && this.sourceNode.x < this.targetNode.x + this.targetNode.width
            && this.sourceNode.y + this.sourceNode.height > this.targetNode.y
            && this.sourceNode.y < this.targetNode.y + this.targetNode.height
          
        return overlapping;
    }
}
