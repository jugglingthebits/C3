import * as Model from "../common/model";

export class ContainerDiagramService {
    private diagrams: Model.ContainerDiagramModel[];
    
    constructor() {
        let container1 = <Model.ContainerNodeModel>{
            id: "containerNode1",
            name: "Container Node 1",
            x: 10,
            y: 10,
            width: 200,
            height: 200,
            description: "Lorem ipsum dolor sit amet",
            componentDiagramId: "componentDiagram1"
        };

        let container2 = <Model.ContainerNodeModel>{
            id: "containerNode2",
            name: "Container Node 2",
            x: 200,
            y: 200,
            width: 200,
            height: 200,
            description: "Lorem ipsum dolor sit amet",
            componentDiagramId: 'componentDiagram1'
        };
        
        let diagram1 = <Model.ContainerDiagramModel>{
            id: "containerDiagram1",
            name: "Container Diagram 1",
            containerNodes: [container1, container2]
        };
        
        let diagram2 = <Model.ContainerDiagramModel>{
            id: "containerDiagram2",
            name: "Container Diagram 2",
            containerNodes: []
        };
        
        this.diagrams = [diagram1, diagram2];
    }
    
    getAll(): Promise<Model.ContainerDiagramModel[]> {
        return new Promise(resolve => resolve(this.diagrams));
    }
}