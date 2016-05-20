import {autoinject} from 'aurelia-framework';
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {EdgeBase} from '../common/edge-base';
import {ContainerNode} from './container-node';
import {SelectionBox} from '../common/selection-box';
import {ContainerDiagramModel} from '../common/model';
import {SystemContextDiagramService} from "../services/system-context-diagram-service";
import {ContainerDiagramService} from "../services/container-diagram-service";
import 'hammerjs/hammer.js';

@autoinject
export class ContainerDiagram extends DiagramBase {
    id: string;
    name: string;
    private containerNodes: ContainerNode[];
    private containerDiagramSection: HTMLElement;
    
    constructor(private eventAggregator: EventAggregator,
                private systemContextDiagramService: SystemContextDiagramService,
                private containerDiagramService: ContainerDiagramService) {
        super();
    };
    
    activate(params): void {
        this.systemContextDiagramService.getAll().then(diagrams => {
            let systemContextDiagramModel = diagrams.find(m => m.id === params.systemContextDiagramId);            
            this.eventAggregator.publish("SystemContextDiagramModelChanged", systemContextDiagramModel);
        });
        
        this.containerDiagramService.getAll()
            .then(diagrams => {
                let containerDiagramModel = diagrams.find(m => m.id === params.id);
                this.updateFromModel(containerDiagramModel);                                         
                this.eventAggregator.publish("ContainerDiagramModelChanged", containerDiagramModel);
            });
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.containerDiagramSection);
    }
    
    getNodes(): NodeBase[] {
        let nodes = this.containerNodes;
        return nodes;
    }
    
    getEdges(): EdgeBase[] {
        return [];
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
