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
        
        const sourceX = this.sourceNode.x + this.sourceNode.width / 2;
        const sourceY = this.sourceNode.y + this.sourceNode.height / 2;
        
        this.path.push(<Point>{x: sourceX, y: sourceY}); 
        
        const targetX = this.targetNode.x + this.targetNode.width / 2;
        const targetY = this.targetNode.y + this.targetNode.height / 2;
        
        this.path.push(<Point>{x: targetX, y: targetY});
    }
}