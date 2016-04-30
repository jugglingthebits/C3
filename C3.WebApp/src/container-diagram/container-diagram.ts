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
    id: string;
    name: string;
    private containerNodes: ContainerNode[];
    private containerDiagramSection: HTMLElement;
    
    constructor(private eventAggregator: EventAggregator,
                private containerDiagramService: ContainerDiagramService) {
        super();
    };
    
    activate(params): void {
        this.containerDiagramService.getAll()
            .then(diagrams => {
                let containerDiagramModel = diagrams.find(m => m.id === params.id);
                this.updateFromModel(containerDiagramModel);                                         
                this.eventAggregator.publish("ContainerDiagramModelChanged", containerDiagramModel.id);
            });
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.containerDiagramSection);
    }
    
    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.containerNodes);
        return nodes;
    }
    
    updateFromModel(model: ContainerDiagramModel): void {
        this.id = model.id;
        this.name = model.name;
        this.containerNodes = model.containerNodes.map(nodeModel => {
            let node = new ContainerNode();
            node.updateFromModel(nodeModel);
            return node;
        });
    }
    
    copyToModel(): ContainerDiagramModel {
        let model = <ContainerDiagramModel>{};
        model.id = this.id;
        model.name = this.name;
        model.containerNodes = this.containerNodes.map(node => node.copyToModel());
        return model;
    }
}
