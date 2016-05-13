import * as Model from "../common/model";

export class ComponentDiagramService {
    private diagrams: Model.ComponentDiagramModel[];
    
    constructor() {
        let componentNode = <Model.ComponentNodeModel>{
            id: "componentNode1",
            name: "Component Node 1",
            x: 100,
            y: 100
        };
        
        let diagram = <Model.ComponentDiagramModel>{
            id: "componentDiagram1",
            name: "Component Diagram 1",
            componentNodes: [componentNode]
        };
        
        this.diagrams = [diagram]; 
    }
    
    getAll(): Promise<Model.ComponentDiagramModel[]> {
        return new Promise(resolve => resolve(this.diagrams));
    }
}