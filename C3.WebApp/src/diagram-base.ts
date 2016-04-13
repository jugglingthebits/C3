import {NodeBase} from './node-base';
import {SelectionBox} from 'selection-box';
import 'hammerjs/hammer.js';

export abstract class DiagramBase {
    abstract getNodes(): NodeBase[];
    private isPanning: boolean;
    private selectionBox: SelectionBox;

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

    protected attachHammerEventHandler(element: SVGElement) {
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
                    c.pan(event.deltaX, event.deltaY)
                }
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
