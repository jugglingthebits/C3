import {NodeBase} from './node-base';

interface Point {
    x: number;
    y: number;
}

export abstract class EdgeBase {
    path: Point[];
    sourceNode: NodeBase;
    targetNode: NodeBase;

    updatePath() {
        this.path = [];

        if (this.areNodesOverlapping())
            return;        
        
        const sourcePoint = this.getNodeConnectionPoint(this.sourceNode, this.targetNode);
        this.path.push(sourcePoint);
        
        const targetPoint = this.getNodeConnectionPoint(this.targetNode, this.sourceNode);
        this.path.push(targetPoint);
    }
    
    private areNodesOverlapping(): boolean {
        const overlapping = 
               this.sourceNode.x + this.sourceNode.width > this.targetNode.x
            && this.sourceNode.x < this.targetNode.x + this.targetNode.width
            && this.sourceNode.y + this.sourceNode.height > this.targetNode.y
            && this.sourceNode.y < this.targetNode.y + this.targetNode.height
          
        return overlapping;
    }
    
    private getNodeConnectionPoint(connectionNode: NodeBase, otherNode: NodeBase) {
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
                return topCenter;
            }
            else {
                const bottomCenter: Point = {
                    x: connectionNode.x + connectionNode.width / 2,
                    y: connectionNode.y + connectionNode.height
                }
                return bottomCenter;
            }
        } else {
            if (connectionNode.x > otherNode.x) {
                const leftCenter: Point = {
                    x: connectionNode.x,
                    y: connectionNode.y + connectionNode.height / 2
                }
                return leftCenter;
            }
            else {
                const bottomCenter: Point = {
                    x: connectionNode.x + connectionNode.width,
                    y: connectionNode.y + connectionNode.height / 2
                }
                return bottomCenter;
            }
        }
    }

    private getNodeCenter(node: NodeBase): Point {
        const centerX = node.x + node.width / 2;
        const centerY = node.y + node.height / 2;
        return {x: centerX, y: centerY}
    }
}
