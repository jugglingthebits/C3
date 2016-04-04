import {autoinject} from 'aurelia-framework';
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {ContainerNode} from './container-node';
import {SelectionBox} from 'selection-box';
import 'hammerjs/hammer.js';

@autoinject
export class ContainerDiagram {
    private selectionBox: SelectionBox;
    private containerNodes: ContainerNode[];
    private containerDiagramElement: SVGElement;
    private isPanning: boolean;
    
    constructor() {
        //TODO: Where to move this to?
        DIContainer.instance.registerTransient(ContainerNode);
        
        this.createContainers();
    };
    
    private unselectAll(): void {
        for(var c of this.containerNodes) {
            c.isSelected = false;
        };
    }
    
    private createContainers(): void {
        var container1: ContainerNode = DIContainer.instance.get(ContainerNode);
        container1.x = 10;
        container1.y = 10;
        container1.name = "abc";
        container1.description = "Lorem ipsum dolor sit amet";
        
        var container2 = DIContainer.instance.get(ContainerNode);
        container2.x = 200;
        container2.y = 200;
        container2.name = "def";
        container2.description = "Lorem ipsum dolor sit amet";
        
        this.containerNodes = [
            container1, 
            container2    
        ];
        
        this.isPanning = false;
    }
    
    private getContainerHit(x: number, y: number): ContainerNode {
        for(var c of this.containerNodes) {
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
        var self: ContainerDiagram = this;
        var hammertime = new Hammer(this.containerDiagramElement);
        
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
            
            for(var c of this.containerNodes) {
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
            for (var c of this.containerNodes) {
                if (c.isSelected) {
                    c.pan(event.deltaX, event.deltaY)
                }
            }
        }
        else {
            this.selectionBox.pan(event.deltaX, event.deltaY);
            for(var c of this.containerNodes) {
                c.isSelected = this.selectionBox.containsRect(c.x, c.y, c.width, c.height);
            }
        }
    }
    
    private onPanEnd(event: HammerInput) {
        if (this.isPanning) {
            for(var c of this.containerNodes) {
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
        for(var c of this.containerNodes) {
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
    
    //TODO: Move to service.
    /*activate() {
        return this.http.fetch('api/containers')
                   .then(response => response.json())
                   .then(containers => this.containers = containers);
    }*/
}
