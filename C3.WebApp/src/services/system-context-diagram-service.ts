import {SystemContextDiagramModel} from '../common/model';

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