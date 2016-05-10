import {autoinject} from 'aurelia-framework';
import {ActorNode} from './actor-node';
import {SystemNode} from './system-node';
import {SystemContextDiagram} from './system-context-diagram';
import {ConnectorModel} from '../common/model';

@autoinject
export class Connector {
    id: string;
    name: string;
    description: string;
    sourceNode: ActorNode | SystemNode;
    targetNode: SystemNode;
    parentDiagram: SystemContextDiagram;
    
    constructor() {
    }
    
    updateFromModel(model: ConnectorModel): void {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description;
        this.sourceNode = this.parentDiagram.actorNodes.find(a => a.id === model.sourceNodeId) 
                       || this.parentDiagram.systemNodes.find(s => s.id === model.sourceNodeId);
                       
        this.targetNode = this.parentDiagram.systemNodes.find(s => s.id === model.targetNodeId);
    }
    
    copyToModel(): ConnectorModel {
        let model = <ConnectorModel>{};
        model.id = this.id;
        model.name = this.name;
        model.description = this.description;
        model.sourceNodeId = this.sourceNode.id;
        model.targetNodeId = this.targetNode.id;
        return model;
    }
}
