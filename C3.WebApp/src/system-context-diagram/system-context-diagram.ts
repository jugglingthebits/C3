import {autoinject, Container} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SystemNode} from './system-node';
import {ActorNode} from './actor-node';
import {SystemActorEdge} from './system-actor-edge';
import {SystemContextDiagramModel} from '../common/model';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {EdgeBase} from '../common/edge-base';
import {SystemContextDiagramService} from '../services/system-context-diagram-service'; 

@autoinject
export class SystemContextDiagram extends DiagramBase {
    id: string;
    name: string;
    actorNodes: ActorNode[];    
    systemNodes: SystemNode[];
    systemActorEdges: SystemActorEdge[];
    
    private diagramElement: SVGElement;
    
    constructor(private eventAggregator: EventAggregator, 
                private router: Router,
                private container: Container,
                private systemContextDiagramService: SystemContextDiagramService) {
        super();
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.diagramElement);
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
    
    getEdges(): EdgeBase[] {
        let edges = this.systemActorEdges;
        return edges;
    }
    
    updateFromModel(model: SystemContextDiagramModel): void {
        this.id = model.id;
        this.name = model.name;
        this.actorNodes = model.actorNodes.map(nodeModel => {
            let node = <ActorNode>this.container.get(ActorNode);
            node.updateFromModel(nodeModel);
            return node;
        });
        this.systemNodes = model.systemNodes.map(nodeModel => {
            let node = <SystemNode>this.container.get(SystemNode);
            node.updateFromModel(nodeModel);
            return node;
        });
        this.systemActorEdges = model.edges.map(edgeModel => {
           let connector = <SystemActorEdge>this.container.get(SystemActorEdge);
           connector.parentDiagram = this;
           connector.updateFromModel(edgeModel);
           return connector;
        });
    }
    
    copyToModel(): SystemContextDiagramModel {
        let model = <SystemContextDiagramModel>{};
        model.id = this.id;
        model.name = this.name;
        model.actorNodes = this.actorNodes.map(node => node.copyToModel());
        model.systemNodes = this.systemNodes.map(node => node.copyToModel());
        model.edges = this.systemActorEdges.map(connector => connector.copyToModel());
        return model;
    }
}
