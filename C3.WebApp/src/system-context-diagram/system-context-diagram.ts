import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SystemNode} from './system-node';
import {ActorNode} from './actor-node';
import {SystemContextDiagramModel} from '../common/model';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {SystemContextDiagramService} from '../services/diagram-services'; 

@autoinject
export class SystemContextDiagram extends DiagramBase {
    id: string;
    name: string;
    
    private actorNodes: ActorNode[];    
    private systemNodes: SystemNode[];
    private systemContextDiagramSection: HTMLElement;
    
    constructor(private eventAggregator: EventAggregator, 
                private router: Router,
                private systemContextDiagramService: SystemContextDiagramService) {
        super();
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.systemContextDiagramSection);
    }
    
    activate(params): void {
        this.systemContextDiagramService.getAll().then(diagrams => {
            let systemContextDiagramModel = diagrams.find(m => m.id === params.id);
            
            if (!systemContextDiagramModel) {
                this.router.navigateToRoute('system-context-diagram', {'id': diagrams[0].id});
                return;
            }
                        
            this.updateFromModel(systemContextDiagramModel);                                             
            this.eventAggregator.publish("SystemContextDiagramModelChanged", systemContextDiagramModel);
        });
    }
    
    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.systemNodes)
             .concat(<NodeBase[]>this.actorNodes);
        return nodes;
    }
    
    updateFromModel(model: SystemContextDiagramModel): void {
        this.id = model.id;
        this.name = model.name;
        this.actorNodes = model.actorNodes.map(nodeModel => {
            let node = new ActorNode();
            node.parentDiagram = this;
            node.updateFromModel(nodeModel);
            return node;
        });
        this.systemNodes = model.systemNodes.map(nodeModel => {
            let node = new SystemNode();
            node.parentDiagram = this;
            node.updateFromModel(nodeModel);
            return node;
        });
    }
    
    copyToModel(): SystemContextDiagramModel {
        let model = <SystemContextDiagramModel>{};
        model.id = this.id;
        model.name = this.name;
        model.actorNodes = this.actorNodes.map(node => node.copyToModel());
        model.systemNodes = this.systemNodes.map(node => node.copyToModel());
        return model;
    }
}
