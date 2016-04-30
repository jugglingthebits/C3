import {SystemContextDiagramModel, ContainerDiagramModel} from '../common/model';

export class SystemContextDiagramService {
    getAll(): SystemContextDiagramModel[] {
        let diagram1 = {
            id: "system 1",
            name: "system 1",
            systemNodes: [],
            actorNodes: []
        };
        
        let diagram2 = {
            id: "system 2",
            name: "system 2",
            systemNodes: [],
            actorNodes: []
        };
        
        return [diagram1, diagram2];
    }
}

export class ContainerDiagramService {
    getAll(): ContainerDiagramModel[] {
        let diagram1 = {
            id: "container 1",
            name: "container 1",
            containerNodes: []
        };
        
        let diagram2 = {
            id: "container 2",
            name: "container 2",
            containerNodes: []
        };
        
        return [diagram1, diagram2];
    }
}
