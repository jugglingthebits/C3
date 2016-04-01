import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Container} from './container';
import {bindable} from "aurelia-framework";
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'hammerjs/hammer.js';
import {LogManager} from 'aurelia-framework';
import {SelectionBox} from 'selection-box';

let logger = LogManager.getLogger('ContainerDiagram');

@autoinject
export class Containers {
    Svg2: SVGElement;
    Selection: SelectionBox;
    Containers: Container[];
    
    constructor(private http: HttpClient, private eventAggregator: EventAggregator) {
        //TODO: Where to move this to?
        DIContainer.instance.registerTransient(Container);
        
        this.eventAggregator.subscribe("unselectAll", () => this.unselectAll());
        
        this.createContainers();
    };
    
    private unselectAll(): void {
        for(var c of this.Containers) {
            c.IsSelected = false;
        };
    }
    
    private createContainers(): void {
        var container1: Container = DIContainer.instance.get(Container);
        container1.X = 10;
        container1.Y = 10;
        container1.Name = "abc";
        container1.Description = "Lorem ipsum dolor sit amet";
        
        var container2 = DIContainer.instance.get(Container);
        container2.X = 200;
        container2.Y = 200;
        container2.Name = "def";
        container2.Description = "Lorem ipsum dolor sit amet";
        
        this.Containers = [
            container1, 
            container2    
        ];
        
        this.isPanning = false;
    }
    
    private getContainerHit(x: number, y: number): Container {
        for(var c of this.Containers) {
            if (c.IsHit(x, y)) {
                return c;
            }
        }
        return null;
    }
    
    private isPanning: boolean;
    
    attached(): void {
        var self: Containers = this;
        var hammertime = new Hammer(this.Svg2);
        hammertime.on('panstart', (event: HammerInput) => {
            logger.debug('pan event: ' + event.type);
            
            let containerHit = self.getContainerHit(event.pointers[0].offsetX, event.pointers[0].offsetY);
            if (containerHit !== null) {
                if (!containerHit.IsSelected) {
                    if (!event.srcEvent.ctrlKey) {
                        self.unselectAll();
                    }
                    containerHit.IsSelected = true;
                }
                
                for(var c of self.Containers) {
                    if (c.IsSelected) {
                        c.StartPan();
                    }
                }
                self.isPanning = true;
                return;
            }
            else {
                self.Selection = DIContainer.instance.get(SelectionBox);
                self.Selection.X = event.center.x;
                self.Selection.Y = event.center.y;
            }
        });
        hammertime.on('pan', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            
            if (self.isPanning) {
                for (var c of self.Containers) {
                    if (c.IsSelected) {
                        c.Pan(event.deltaX, event.deltaY)
                    }
                }
            }
            else {
                self.Selection.Width = event.deltaX;
                self.Selection.Height = event.deltaY;
            }
        });
        hammertime.on('panend', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            
            if (self.isPanning) {
                for(var c of self.Containers) {
                    if (c.IsSelected) {
                        c.EndPan();
                    }
                }
                self.isPanning = false;
            }
            else {
                self.Selection = null;
            }
        });
        
        hammertime.on('tap', function(event: HammerInput) {
            logger.debug('event: ' + event.type);

            for(var c of self.Containers) {
                if (c.IsHit(event.pointers[0].offsetX, event.pointers[0].offsetY)) {
                    if (event.srcEvent.ctrlKey) {
                        c.IsSelected = !c.IsSelected;
                    }
                    else {
                        self.unselectAll();
                        c.IsSelected = true;
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