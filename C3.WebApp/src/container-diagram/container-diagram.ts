import {autoinject} from 'aurelia-framework';
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {ContainerNode} from './container-node';
import {SelectionBox} from '../common/selection-box';
import {ContainerDiagramModel} from '../common/model';
import {ContainerDiagramService} from '../services/diagram-services';
import 'hammerjs/hammer.js';

@autoinject
export class ContainerDiagram extends DiagramBase {
    private containerDiagramModel: ContainerDiagramModel;
    private containerNodes: ContainerNode[];
    private containerDiagramSection: HTMLElement;
    
    constructor(private eventAggregator: EventAggregator,
                private containerDiagramService: ContainerDiagramService) {
        super();
        this.createContainers();
    };
    
    activate(params): void {
        this.containerDiagramModel = this.containerDiagramService.getAll()
                                         .find(m => m.id === params.id);
        this.eventAggregator.publish("ContainerDiagramModelChanged", this.containerDiagramModel);
    }
    
    private createContainers(): void {
        var container1 = new ContainerNode();
        container1.x = 10;
        container1.y = 10;
        container1.name = "abc";
        container1.description = "Lorem ipsum dolor sit amet";
        
        var container2 = new ContainerNode();
        container2.x = 200;
        container2.y = 200;
        container2.name = "def";
        container2.description = "Lorem ipsum dolor sit amet";
        
        this.containerNodes = [
            container1, 
            container2    
        ];
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.containerDiagramSection);
    }
    
    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.containerNodes);
        return nodes;
    }
    
    //TODO: Move to service.
    /*activate() {
        return this.http.fetch('api/containers')
                   .then(response => response.json())
                   .then(containers => this.containers = containers);
    }*/
}
