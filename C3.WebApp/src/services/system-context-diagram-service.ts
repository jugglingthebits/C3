// import 'fetch';
// import {HttpClient} from 'aurelia-fetch-client';
import {SystemContextDiagramModel, ContainerDiagramModel, 
        SystemNodeModel, ActorNodeModel, ContainerNodeModel, 
        ComponentDiagramModel, ComponentNodeModel, SystemActorEdgeModel} 
    from "../common/model";

export class SystemContextDiagramService {
    private diagrams: SystemContextDiagramModel[];
    
    constructor() {
        const systemNode1 = <SystemNodeModel>{
            id: "systemNode1",
            name: "System Node 1",
            x: 20,
            y: 20,
            width: 200,
            height: 200,
            containerDiagramId: "containerDiagram1"
        };
        
        const actorNode1 = <ActorNodeModel>{
            id: "actorNode1",
            name: "Actor Node 1",
            x: 400,
            y: 100,
            width: 200,
            height: 200
        };
        
        const externalSystem1 = <SystemNodeModel>{
            id: "externalSystemNode1",
            name: "External System Node 1",
            x: 20,
            y: 250,
            isExternalSystem: true,
            width: 200,
            height: 200
        };
        
        const edge1 = <SystemActorEdgeModel>{
            id: 'systemActorEdge1',
            name: 'System Actor Edge 1',
            sourceNodeId: 'systemNode1',
            targetNodeId: 'actorNode1'
        };

        const diagram1 = <SystemContextDiagramModel>{
            id: "systemContextDiagram1",
            name: "System Context Diagram 1",
            systemNodes: [systemNode1, externalSystem1],
            actorNodes: [actorNode1],
            edges: [edge1]
        };
        
        const diagram2 = <SystemContextDiagramModel>{
            id: "systemContextDiagram2",
            name: "System Context Diagram 2",
            systemNodes: [],
            actorNodes: [],
            edges: []
        };
        
        this.diagrams = [diagram1, diagram2];
    }
    
    getAll(): Promise<SystemContextDiagramModel[]> {
        return new Promise(resolve => resolve(this.diagrams));
    }
    
    // private loadFromId(id: number): Promise<SystemContextDiagramModel> {
    //     const httpClient = new HttpClient();
    //     httpClient.configure(config => config.withBaseUrl('api')
    //                                          .rejectErrorResponses());

    //     return httpClient.fetch(`/system/${id}`)
    //                      .then(response => <Promise<SystemContextDiagramModel>>response.json());
    // }
}
