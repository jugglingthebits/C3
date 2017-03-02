import * as Model from "../common/model";

export class ContainerDiagramService {
    private diagrams: Model.ContainerDiagram[];
    
    constructor() {
        const container1 = <Model.Container>{
            id: "containerNode1",
            name: "Container Node 1",
            x: 10,
            y: 10,
            width: 200,
            height: 200,
            description: "Lorem ipsum dolor sit amet",
            componentDiagramId: "componentDiagram1"
        };

        const container2 = <Model.Container>{
            id: "containerNode2",
            name: "Container Node 2",
            x: 200,
            y: 200,
            width: 200,
            height: 200,
            description: "Lorem ipsum dolor sit amet",
            componentDiagramId: 'componentDiagram1'
        };
        
        const diagram1 = <Model.ContainerDiagram>{
            id: "containerDiagram1",
            name: "Container Diagram 1",
            containers: [container1, container2]
        };
        
        const diagram2 = <Model.ContainerDiagram>{
            id: "containerDiagram2",
            name: "Container Diagram 2",
            containers: []
        };
        
        this.diagrams = [diagram1, diagram2];
    }
    
    getAll(): Promise<Model.ContainerDiagram[]> {
        return new Promise(resolve => resolve(this.diagrams));
    }
}