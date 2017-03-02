// import 'fetch';
// import {HttpClient} from 'aurelia-fetch-client';
import {SystemContextDiagram, ContainerDiagram, 
        System, ActorModel, Container, 
        ComponentDiagramModel, ComponentNodeModel, ActorSystemUsing} 
    from "../common/model";

export class SystemContextDiagramService {
    private diagrams: SystemContextDiagram[];
    
    constructor() {
        const systemNode1 = <System>{
            id: "systemNode1",
            name: "System Node 1",
            x: 20,
            y: 20,
            width: 200,
            height: 200,
            containerDiagramId: "containerDiagram1"
        };
        
        const actorNode1 = <ActorModel>{
            id: "actorNode1",
            name: "Actor Node 1",
            x: 400,
            y: 100,
            width: 200,
            height: 200
        };
        
        const externalSystem1 = <System>{
            id: "externalSystemNode1",
            name: "External System Node 1",
            x: 20,
            y: 250,
            isExternal: true,
            width: 200,
            height: 200
        };
        
        const edge1 = <ActorSystemUsing>{
            id: 'systemActorEdge1',
            name: 'System Actor Edge 1',
            sourceNodeId: 'systemNode1',
            targetNodeId: 'actorNode1'
        };

        const diagram1 = <SystemContextDiagram>{
            id: "systemContextDiagram1",
            name: "System Context Diagram 1",
            systems: [systemNode1, externalSystem1],
            actors: [actorNode1],
            edges: [edge1]
        };
        
        const diagram2 = <SystemContextDiagram>{
            id: "systemContextDiagram2",
            name: "System Context Diagram 2",
            systems: [],
            actors: [],
            edges: []
        };
        
        this.diagrams = [diagram1, diagram2];
    }
    
    getAll(): Promise<SystemContextDiagram[]> {
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
