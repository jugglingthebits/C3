import {transient} from 'aurelia-framework';
import {ActorModel} from '../common/model';
import {NodeBase} from '../common/node-base';
import {SystemContextDiagram} from './system-context-diagram';

@transient()
export class ActorNode extends NodeBase {
    id: string;
    
    constructor() {
        super();
        this.width = 200;
        this.height = 200;
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