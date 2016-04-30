import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {SystemNode} from './system-node';
import {ActorNode} from './actor-node';
import {SystemContextDiagramModel, SystemContextDiagramModelChanged} from '../common/model';
import {DiagramBase} from '../common/diagram-base';
import {NodeBase} from '../common/node-base';
import {SystemContextDiagramService} from '../services/system-context-diagram-service'; 

@autoinject
export class SystemContextDiagram extends DiagramBase {
    id: string;
    name: string;
    
    private systemContextDiagramModel: SystemContextDiagramModel;
    private actorNodes: ActorNode[];    
    private systemNodes: SystemNode[];
    private systemContextDiagramSection: HTMLElement;
    
    constructor(private eventAggregator: EventAggregator, 
                private router: Router,
                private systemContextDiagramService: SystemContextDiagramService) {
        super();
        this.name = 'system 1';
        
        this.createExampleNodes();
    }
    
    private createExampleNodes() {
        let systemNode1 = new SystemNode();
        systemNode1.id = "System1";
        systemNode1.name = "System 1";
        systemNode1.x = 20;
        systemNode1.y = 20;
        
        let actorNode1 = new ActorNode();
        actorNode1.x = 100;
        actorNode1.y = 100;
        actorNode1.name = "Actor 1";
        
        let externalSystem1 = new SystemNode();
        externalSystem1.id = "ExternalSystem1";
        externalSystem1.name = "External System 1";
        externalSystem1.x = 20;
        externalSystem1.y = 250;
        externalSystem1.isExternalSystem = true;
                
        this.systemNodes = [systemNode1, externalSystem1];
        this.actorNodes = [actorNode1];
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.systemContextDiagramSection);
    }
    
    activate(params): void {
        // TODO
        //this.loadFromId(params.id); 
        
        this.systemContextDiagramModel = this.systemContextDiagramService.getAll()
                                             .find(m => m.id === params.id);
        this.eventAggregator.publish("SystemContextDiagramModelChanged", this.systemContextDiagramModel);
    }
    
    private loadFromId(id: number) {
        let httpClient = new HttpClient();
        httpClient.configure(config => config.withBaseUrl('api')
                                             .rejectErrorResponses());

        httpClient.fetch(`/system/${id}`)
            .then(response => <Promise<SystemContextDiagramModel>>response.json())
            .then(model => {
                this.updateFromModel(model);
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
            node.updateFromModel(nodeModel);
            return node;
        });
        this.systemNodes = model.systemNodes.map(nodeModel => {
            let node = new SystemNode();
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
