import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {SystemContextDiagramModel, ContainerDiagramModel, 
        SystemNodeModel, ActorNodeModel, ContainerNodeModel, 
        ComponentDiagramModel, ComponentNodeModel, ConnectorModel} 
    from "../common/model";

export class SystemContextDiagramService {
    private diagrams: SystemContextDiagramModel[];
    
    constructor() {
        let systemNode1 = <SystemNodeModel>{
            id: "systemNode1",
            name: "System Node 1",
            x: 20,
            y: 20,
            width: 200,
            height: 200,
            containerDiagramId: "containerDiagram1"
        };
        
        let actorNode1 = <ActorNodeModel>{
            id: "actorNode1",
            name: "Actor Node 1",
            x: 100,
            y: 100,
            width: 200,
            height: 200
        };
        
        let externalSystem1 = <SystemNodeModel>{
            id: "externalSystemNode1",
            name: "External System Node 1",
            x: 20,
            y: 250,
            isExternalSystem: true,
            width: 200,
            height: 200
        };
        
        let connector = <ConnectorModel>{
            id: 'connector1',
            name: 'Connector 1',
            sourceNodeId: 'systemNode1',
            targetNodeId: 'externalSystemNode1'
        };

        let diagram1 = <SystemContextDiagramModel>{
            id: "systemContextDiagram1",
            name: "System Context Diagram 1",
            systemNodes: [systemNode1, externalSystem1],
            actorNodes: [actorNode1],
            connectors: [connector]
        };
        
        let diagram2 = <SystemContextDiagramModel>{
            id: "systemContextDiagram2",
            name: "System Context Diagram 2",
            systemNodes: [],
            actorNodes: [],
            connectors: []
        };
        
        this.diagrams = [diagram1, diagram2];
    }
    
    getAll(): Promise<SystemContextDiagramModel[]> {
        return new Promise(resolve => resolve(this.diagrams));
    }
    
    private loadFromId(id: number): Promise<SystemContextDiagramModel> {
        let httpClient = new HttpClient();
        httpClient.configure(config => config.withBaseUrl('api')
                                             .rejectErrorResponses());

        return httpClient.fetch(`/system/${id}`)
                         .then(response => <Promise<SystemContextDiagramModel>>response.json());
    }
}
