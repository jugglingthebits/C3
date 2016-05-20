import {autoinject, computedFrom} from 'aurelia-framework';
import {EdgeBase} from '../common/edge-base';
import {ActorNode} from './actor-node';
import {SystemNode} from './system-node';
import {SystemContextDiagram} from './system-context-diagram';
import {EdgeModel} from '../common/model';

@autoinject
export class SystemActorEdge extends EdgeBase {
    id: string;
    name: string;
    description: string;
    parentDiagram: SystemContextDiagram;
    sourceNode: ActorNode | SystemNode;
    targetNode: ActorNode | SystemNode;
    
    constructor() {
        super();
    }
    
    @computedFrom('path')
    get points(): string {
        return `${this.path[0].x},${this.path[0].y} ${this.path[1].x},${this.path[1].y}`;
    }
    
    updateFromModel(model: EdgeModel): void {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description;
        this.sourceNode = this.parentDiagram.actorNodes.find(a => a.id === model.sourceNodeId) 
                       || this.parentDiagram.systemNodes.find(s => s.id === model.sourceNodeId);
                       
        this.targetNode = this.parentDiagram.systemNodes.find(s => s.id === model.targetNodeId)
                       || this.parentDiagram.actorNodes.find(s => s.id === model.targetNodeId);
        
        this.updatePath();
    }
    
    copyToModel(): EdgeModel {
        let model = <EdgeModel>{};
        model.id = this.id;
        model.name = this.name;
        model.description = this.description;
        model.sourceNodeId = this.sourceNode.id;
        model.targetNodeId = this.targetNode.id;
        return model;
    }
}
