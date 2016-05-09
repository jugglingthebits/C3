import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {SystemContextDiagramModel, ContainerDiagramModel, 
        SystemNodeModel, ActorNodeModel, ContainerNodeModel, ComponentDiagramModel} 
    from '../common/model';

export class SystemContextDiagramService {
    private diagrams: SystemContextDiagramModel[];
    
    constructor() {
        let systemNode1 = <SystemNodeModel>{
            id: "SystemNode1",
            name: "System Node 1",
            x: 20,
            y: 20,
            width: 200,
            height: 200,
            containerDiagramId: "ContainerDiagram1"
        };
        
        let actorNode1 = <ActorNodeModel>{
            id: "ActorNode1",
            name: "Actor Node 1",
            x: 100,
            y: 100,
            width: 200,
            height: 200
        };
        
        let externalSystem1 = <SystemNodeModel>{
            id: "ExternalSystemNode1",
            name: "External System Node 1",
            x: 20,
            y: 250,
            isExternalSystem: true,
            width: 200,
            height: 200
        };

        let diagram1 = <SystemContextDiagramModel>{
            id: "SystemContextDiagram1",
            name: "System Context Diagram 1",
            systemNodes: [systemNode1, externalSystem1],
            actorNodes: [actorNode1]
        };
        
        let diagram2 = <SystemContextDiagramModel>{
            id: "SystemContextDiagram2",
            name: "System Context Diagram 2",
            systemNodes: [],
            actorNodes: []
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

export class ContainerDiagramService {
    private diagrams: ContainerDiagramModel[];
    
    constructor() {
        var container1 = <ContainerNodeModel>{
            id: "ContainerNode1",
            name: "Container Node 1",
            x: 10,
            y: 10,
            width: 200,
            height: 200,
            description: "Lorem ipsum dolor sit amet"
        };

        var container2 = <ContainerNodeModel>{
            id: "ContainerNode2",
            name: "Container Node 2",
            x: 200,
            y: 200,
            width: 200,
            height: 200,
            description: "Lorem ipsum dolor sit amet"
        };
        
        let diagram1 = <ContainerDiagramModel>{
            id: "ContainerDiagram1",
            name: "Container Diagram 1",
            containerNodes: [container1, container2]
        };
        
        let diagram2 = <ContainerDiagramModel>{
            id: "ContainerDiagram2",
            name: "Container Diagram 2",
            containerNodes: []
        };
        
        this.diagrams = [diagram1, diagram2];
    }
    
    getAll(): Promise<ContainerDiagramModel[]> {
        return new Promise(resolve => resolve(this.diagrams));
    }
}

export class ComponentDiagramService {
    private diagrams: ComponentDiagramModel[];
    
    getAll(): Promise<ComponentDiagramModel[]> {
        return new Promise(resolve => resolve(this.diagrams));
    }
}