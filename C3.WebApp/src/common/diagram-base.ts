import {NodeBase} from './node-base';
import {EdgeBase} from './edge-base';
import {SelectionBox} from './selection-box';

export class BoundingBox {
    constructor(public x: number, public y: number, 
                public width: number, public height: number) {}
}

export abstract class DiagramBase {
    abstract getNodes(): NodeBase[];
    abstract getEdges(): EdgeBase[];
    
    private isPanning: boolean;
    private selectionBox: SelectionBox;

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

    private unselectAll(): void {
        for(var c of this.getNodes()) {
            c.isSelected = false;
        };
    }
    
    private getContainerHit(x: number, y: number): NodeBase {
        for(var c of this.getNodes()) {
            if (c.isHit(x, y)) {
                return c;
            }
        }
        return null;
    }
    
    // private onTap(event: HammerInput, element: SVGElement) {
    //     const clientRect = element.getBoundingClientRect();
    //     const eventX = event.pointers[0].x - clientRect.left;
    //     const eventY = event.pointers[0].y - clientRect.top;
        
    //     for(var c of this.getNodes()) {
    //         if (c.isHit(eventX, eventY)) {
    //             if (event.srcEvent.ctrlKey) {
    //                 c.isSelected = !c.isSelected;
    //             }
    //             else {
    //                 this.unselectAll();
    //                 c.isSelected = true;
    //             }
    //             return;
    //         }
    //     }
        
    //     // no container hit
    //     this.unselectAll();
    // }
    
    protected updateEdgePaths() {
        this.getEdges().forEach(e => e.updatePath());
    }
}
