import {NodeBase} from './node-base';
import {PathFinder} from './path-finder';

export interface Point {
    x: number;
    y: number;
}

export enum Direction {
    North, South, East, West
}

export abstract class EdgeBase {
    path: Point[];
    sourceNode: NodeBase;
    targetNode: NodeBase;
    
    constructor(private pathFinder: PathFinder) {}

    updatePath() {
        if (this.areNodesOverlapping())
            return;        
 
        const sourceConnectionPoints = this.sourceNode.getConnectionPoints();
        const targetConnectionPoints = this.targetNode.getConnectionPoints();
        this.path = this.pathFinder.findPath(sourceConnectionPoints, targetConnectionPoints);
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
