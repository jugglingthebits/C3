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
 
        const sourcePoint = this.getNodeConnector(this.sourceNode, this.targetNode);
        const targetPoint = this.getNodeConnector(this.targetNode, this.sourceNode);
        this.path = this.pathFinder.findPath(sourcePoint[0], sourcePoint[1], 
                                             targetPoint[0], targetPoint[1]);
    }
    
    private areNodesOverlapping(): boolean {
        const overlapping = 
               this.sourceNode.x + this.sourceNode.width > this.targetNode.x
            && this.sourceNode.x < this.targetNode.x + this.targetNode.width
            && this.sourceNode.y + this.sourceNode.height > this.targetNode.y
            && this.sourceNode.y < this.targetNode.y + this.targetNode.height
          
        return overlapping;
    }
    
    private getNodeConnector(connectionNode: NodeBase, otherNode: NodeBase): [Point, Direction] {
        const connectionNodeCenter = this.getNodeCenter(connectionNode);
        const otherNodeCenter = this.getNodeCenter(otherNode);
        
        const diffX = Math.abs(connectionNodeCenter.x - otherNodeCenter.x);
        const diffY = Math.abs(connectionNodeCenter.y - otherNodeCenter.y);
        
        if (diffX < diffY) {
            if (connectionNode.y > otherNode.y) {
                const topCenter: Point = {
                    x: connectionNode.x + connectionNode.width / 2,
                    y: connectionNode.y
                }
                return [topCenter, Direction.North];
            }
            else {
                const bottomCenter: Point = {
                    x: connectionNode.x + connectionNode.width / 2,
                    y: connectionNode.y + connectionNode.height
                }
                return [bottomCenter, Direction.South];
            }
        } else {
            if (connectionNode.x > otherNode.x) {
                const leftCenter: Point = {
                    x: connectionNode.x,
                    y: connectionNode.y + connectionNode.height / 2
                }
                return [leftCenter, Direction.West];
            }
            else {
                const rightCenter: Point = {
                    x: connectionNode.x + connectionNode.width,
                    y: connectionNode.y + connectionNode.height / 2
                }
                return [rightCenter, Direction.East];
            }
        }
    }

    private getNodeCenter(node: NodeBase): Point {
        const centerX = node.x + node.width / 2;
        const centerY = node.y + node.height / 2;
        return {x: centerX, y: centerY}
    }
}
