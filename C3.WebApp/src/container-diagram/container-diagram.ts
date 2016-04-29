import {autoinject} from 'aurelia-framework';
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {ContainerNode} from './container-node';
import {SelectionBox} from '../common/selection-box';
import 'hammerjs/hammer.js';

@autoinject
export class ContainerDiagram extends DiagramBase {
    id: string;
    
    private containerNodes: ContainerNode[];
    private containerDiagramSection: HTMLElement;
    
    constructor() {
        super();
        this.createContainers();
    };
    
    activate(params): void {
        this.id = params.id;
        //TODO: Load diagram.
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
