import {autoinject} from 'aurelia-framework';
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {ComponentNode} from './component-node';
import {SelectionBox} from '../common/selection-box';
import {ComponentDiagramModel} from '../common/model';
import {SystemContextDiagramService} from '../services/system-context-diagram-service';
import {ContainerDiagramService} from '../services/container-diagram-service';
import {ComponentDiagramService} from '../services/component-diagram-service';
import 'hammerjs/hammer.js';

@autoinject
export class ComponentDiagram extends DiagramBase {
    id: string;
    name: string;
    private componentNodes: ComponentNode[];
    private componentDiagramSection: HTMLElement;
    
    constructor(private eventAggregator: EventAggregator,
                private systemContextDiagramService: SystemContextDiagramService,
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
                this.eventAggregator.publish('ComponentDiagramModelChanged', componentDiagramModel);
            });
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.componentDiagramSection);
    }
    
    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.componentNodes);
        return nodes;
    }
    
    updateFromModel(model: ComponentDiagramModel): void {
        this.id = model.id;
        this.name = model.name;
        this.componentNodes = model.componentNodes.map(nodeModel => {
            let node = new ComponentNode();
            node.updateFromModel(nodeModel);
            return node;
        });
    }
    
    copyToModel(): ComponentDiagramModel {
        let model = <ComponentDiagramModel>{};
        model.id = this.id;
        model.name = this.name;
        model.componentNodes = this.componentNodes.map(node => node.copyToModel());
        return model;
    }
}
