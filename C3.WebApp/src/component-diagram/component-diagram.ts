import {autoinject} from 'aurelia-framework';
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {EdgeBase} from '../common/edge-base';
import {ComponentNode} from './component-node';
import {SelectionBox} from '../common/selection-box';
import {ComponentModel} from '../common/model';
import {SystemContextModelService} from '../services/system-context-diagram-service';
import {ContainerDiagramService} from '../services/container-diagram-service';
import {ComponentDiagramService} from '../services/component-diagram-service';

@autoinject
export class ComponentDiagram extends DiagramBase {
    id: string;
    name: string;
    private componentNodes: ComponentNode[];
    private diagramElement: SVGElement;
    
    constructor(private eventAggregator: EventAggregator,
                private systemContextDiagramService: SystemContextModelService,
                private containerDiagramService: ContainerDiagramService,
                private componentDiagramService: ComponentDiagramService) {
        super();
    }
    
    activate(params): void {
        this.systemContextDiagramService.getAll().then(diagrams => {
            let systemContextDiagramModel = diagrams.find(m => m.id === params.systemContextDiagramId);            
            this.eventAggregator.publish('SystemContextDiagramModelChanged', systemContextDiagramModel);
        });
        
        this.containerDiagramService.getAll()
            .then(diagrams => {
                let containerDiagramModel = diagrams.find(m => m.id === params.containerDiagramId);
                this.eventAggregator.publish('ContainerDiagramModelChanged', containerDiagramModel);
            });

        this.componentDiagramService.getAll()
            .then(diagrams => {
                let componentDiagramModel = diagrams.find(m => m.id === params.id);
                this.updateFromModel(componentDiagramModel);
                this.updateEdgePaths();                                       
                this.eventAggregator.publish('ComponentDiagramModelChanged', componentDiagramModel);
            });
    }
    
    getNodes(): NodeBase[] {
        let nodes = this.componentNodes;
        return nodes;
    }

    getEdges(): EdgeBase[] {
        return [];
    }

    updateFromModel(model: ComponentModel): void {
        this.id = model.id;
        this.componentNodes = model.componentNodes.map(nodeModel => {
            let node = new ComponentNode();
            node.updateFromModel(nodeModel);
            return node;
        });
    }
    
    copyToModel(): ComponentModel {
        let model = <ComponentModel>{};
        model.id = this.id;
        model.name = this.name;
        model.componentNodes = this.componentNodes.map(node => node.copyToModel());
        return model;
    }
}
