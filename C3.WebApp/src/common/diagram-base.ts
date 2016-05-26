import {NodeBase} from './node-base';
import {EdgeBase} from './edge-base';
import {SelectionBox} from './selection-box';
import 'hammerjs/hammer.js';

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
            if (!left || left > node.x )
                left = node.x;
            if (!right || right < node.x + node.width)
                right = node.x + node.width - 1;
            if (!top || top > node.y )
                top = node.y;
            if (!bottom || bottom < node.y + node.height)
                bottom = node.y + node.height - 1;
        }
        
        for (var edge of edges) {
            for (var point of edge.path) {
                if (!left || left > point.x)
                    left = point.x;
                if (!right || right < point.x)
                    right = point.x;
                if (!top || top > point.y)
                    top = point.y;
                if (!bottom || bottom < point.y)
                    bottom = point.y;
            }
        }

        if (!left || !right || !top || !bottom)
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

    protected attachHammerEventHandler(element: HTMLElement) {
        var self: DiagramBase = this;
        var hammertime = new Hammer(element);
        
        hammertime.on('panstart', (event: HammerInput) => {
            self.onPanStart(event);
        });
        
        hammertime.on('pan', function(event: HammerInput) {
            self.onPan(event);
        });
        
        hammertime.on('panend', function(event: HammerInput) {
            self.onPanEnd(event);
        });
        
        hammertime.on('tap', function(event: HammerInput) {
            self.onTap(event);
        });
    }
    
    private onPanStart(event: HammerInput) {
        let containerHit = this.getContainerHit(event.pointers[0].offsetX, event.pointers[0].offsetY);
        if (containerHit !== null) {
            if (!containerHit.isSelected) {
                if (!event.srcEvent.ctrlKey) {
                    this.unselectAll();
                }
                containerHit.isSelected = true;
            }
            
            for(var c of this.getNodes()) {
                if (c.isSelected) {
                    c.startPan();
                }
            }
            this.isPanning = true;
            return;
        }
        else {
            this.unselectAll();
            this.selectionBox = new SelectionBox();
            this.selectionBox.x = event.pointers[0].offsetX;
            this.selectionBox.y = event.pointers[0].offsetY;
            this.selectionBox.startPan();
        }
    }
    
    private onPan(event: HammerInput) {
        if (this.isPanning) {
            for (var c of this.getNodes()) {
                if (c.isSelected) {
                    c.pan(event.deltaX, event.deltaY);
                }
            }
            for (var e of this.getEdges()) {
                e.updatePath();
            }
        }
        else {
            this.selectionBox.pan(event.deltaX, event.deltaY);
            for(var c of this.getNodes()) {
                c.isSelected = this.selectionBox.containsRect(c.x, c.y, c.width, c.height);
            }
        }
    }
    
    private onPanEnd(event: HammerInput) {
        if (this.isPanning) {
            for(var c of this.getNodes()) {
                if (c.isSelected) {
                    c.endPan();
                }
            }
            this.isPanning = false;
        }
        else {
            this.selectionBox = null;
        }
    }
    
    private onTap(event: HammerInput) {
        for(var c of this.getNodes()) {
            if (c.isHit(event.pointers[0].offsetX, event.pointers[0].offsetY)) {
                if (event.srcEvent.ctrlKey) {
                    c.isSelected = !c.isSelected;
                }
                else {
                    this.unselectAll();
                    c.isSelected = true;
                }
                return;
            }
        }
        
        // no container hit
        this.unselectAll();
    }
}
