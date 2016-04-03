import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {ContainerNode} from './container-node';
import {bindable} from "aurelia-framework";
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'hammerjs/hammer.js';
import {LogManager} from 'aurelia-framework';
import {SelectionBox} from 'selection-box';

let logger = LogManager.getLogger('ContainerDiagram');

@autoinject
export class ContainerDiagram {
    selectionBox: SelectionBox;
    containerNodes: ContainerNode[];
    private containerDiagramElement: SVGElement;
    private isPanning: boolean;
    
    constructor(private http: HttpClient, private eventAggregator: EventAggregator) {
        //TODO: Where to move this to?
        DIContainer.instance.registerTransient(ContainerNode);
        
        this.eventAggregator.subscribe("unselectAll", () => this.unselectAll());
        
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
        var self: ContainerDiagram = this;
        var hammertime = new Hammer(this.containerDiagramElement);
        
        hammertime.on('panstart', (event: HammerInput) => {
            logger.debug('pan event: ' + event.type);
            
            let containerHit = self.getContainerHit(event.pointers[0].offsetX, event.pointers[0].offsetY);
            if (containerHit !== null) {
                if (!containerHit.isSelected) {
                    if (!event.srcEvent.ctrlKey) {
                        self.unselectAll();
                    }
                    containerHit.isSelected = true;
                }
                
                for(var c of self.containerNodes) {
                    if (c.isSelected) {
                        c.startPan();
                    }
                }
                self.isPanning = true;
                return;
            }
            else {
                self.unselectAll();
                self.selectionBox = DIContainer.instance.get(SelectionBox);
                self.selectionBox.x = event.pointers[0].offsetX;
                self.selectionBox.y = event.pointers[0].offsetY;
                self.selectionBox.startPan();
            }
        });
        
        hammertime.on('pan', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            
            if (self.isPanning) {
                for (var c of self.containerNodes) {
                    if (c.isSelected) {
                        c.pan(event.deltaX, event.deltaY)
                    }
                }
            }
            else {
                self.selectionBox.pan(event.deltaX, event.deltaY);
                for(var c of self.containerNodes) {
                    c.isSelected = self.selectionBox.containsRect(c.x, c.y, c.width, c.height);
                }
            }
        });
        
        hammertime.on('panend', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            
            if (self.isPanning) {
                for(var c of self.containerNodes) {
                    if (c.isSelected) {
                        c.endPan();
                    }
                }
                self.isPanning = false;
            }
            else {
                self.selectionBox = null;
            }
        });
        
        hammertime.on('tap', function(event: HammerInput) {
            logger.debug('event: ' + event.type);

            for(var c of self.containerNodes) {
                if (c.isHit(event.pointers[0].offsetX, event.pointers[0].offsetY)) {
                    if (event.srcEvent.ctrlKey) {
                        c.isSelected = !c.isSelected;
                    }
                    else {
                        self.unselectAll();
                        c.isSelected = true;
                    }
                    return;
                }
            }
            
            // no container hit
            self.unselectAll();
        });
    }
    
    //TODO: Move to service.
    /*activate() {
        return this.http.fetch('api/containers')
                   .then(response => response.json())
                   .then(containers => this.containers = containers);
    }*/
}