import {NodeBase} from './node-base';
import {EdgeBase} from './edge-base';

export class BoundingBox {
    constructor(public x: number, public y: number, 
                public width: number, public height: number) {}
}

export abstract class DiagramBase {
    abstract getNodes(): NodeBase[];
    abstract getEdges(): EdgeBase[];
    
    getBoundingBox(): BoundingBox {
        const nodes = this.getNodes();
        const edges = this.getEdges();
        
        let left: number;
        let right: number;
        let top: number;
        let bottom: number;
        
        for (var node of nodes) {
            if (left === undefined || left > node.x )
                left = node.x;
            if (right === undefined || right < node.x + node.width)
                right = node.x + node.width - 1;
            if (top === undefined || top > node.y )
                top = node.y;
            if (bottom === undefined || bottom < node.y + node.height)
                bottom = node.y + node.height - 1;
        }
        
        for (var edge of edges) {
            for (var point of edge.path) {
                if (left === undefined || left > point.x)
                    left = point.x;
                if (right === undefined || right < point.x)
                    right = point.x;
                if (top === undefined || top > point.y)
                    top = point.y;
                if (bottom === undefined || bottom < point.y)
                    bottom = point.y;
            }
        }

        if (left === undefined || right === undefined || top === undefined || bottom === undefined)
            return new BoundingBox(0, 0, 0, 0);

        const width = right - left + 1;
        const height = bottom - top + 1;
        
        return new BoundingBox(left, top, width, height);
    }
    
    protected updateEdgePaths() {
        this.getEdges().forEach(e => e.updatePath());
    }
}
