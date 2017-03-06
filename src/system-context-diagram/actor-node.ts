import {transient} from 'aurelia-framework';
import {ActorModel} from '../common/model';
import {NodeBase} from '../common/node-base';
import {SystemContextDiagram} from './system-context-diagram';

@transient()
export class ActorNode extends NodeBase {
    static width = 200;
    static height = 200;

    constructor() {
        super();
        this.width = ActorNode.width;
        this.height = ActorNode.height;
    }
    
    updateFromModel(model: ActorModel): void {
        this.id = model.id;
    }
    
    copyToModel(): ActorModel {
        let model = <ActorModel>{};
        model.id = this.id;
        return model;
    }
}