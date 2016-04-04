import {autoinject} from 'aurelia-framework';
import {SystemNode} from 'system-node';
import {SelectionBox} from 'selection-box';
import 'hammerjs/hammer.js';

@autoinject
export class SystemContextDiagram {
    id: string;
    name: string;
    
    private selectionBox: SelectionBox;
    private systemNodes: SystemNode[];
    private systemContextDiagramElement: SVGElement;
    private isPanning: boolean;
    
    constructor() {
        this.name = 'scook';
        
        this.createExampleNodes();
    }
    
    private createExampleNodes() {
        let node1: SystemNode = new SystemNode();
        node1.x = 20;
        node1.y = 20;
        
        this.systemNodes = [node1];
    }
    
    private unselectAll(): void {
        for(var c of this.systemNodes) {
            c.isSelected = false;
        };
    }
    
        private getContainerHit(x: number, y: number): SystemNode {
        for(var c of this.systemNodes) {
            if (c.isHit(x, y)) {
                return c;
            }
        }
        return null;
    }
    
    attached(): void {
        this.attachHammerEventHandler();
    }
    
    private attachHammerEventHandler() {
        var self: SystemContextDiagram = this;
        var hammertime = new Hammer(this.systemContextDiagramElement);
        
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
            
            for(var c of this.systemNodes) {
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
            for (var c of this.systemNodes) {
                if (c.isSelected) {
                    c.pan(event.deltaX, event.deltaY)
                }
            }
        }
        else {
            this.selectionBox.pan(event.deltaX, event.deltaY);
            for(var c of this.systemNodes) {
                c.isSelected = this.selectionBox.containsRect(c.x, c.y, c.width, c.height);
            }
        }
    }
    
    private onPanEnd(event: HammerInput) {
        if (this.isPanning) {
            for(var c of this.systemNodes) {
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
        for(var c of this.systemNodes) {
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
