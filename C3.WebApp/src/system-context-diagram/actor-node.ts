import {transient} from 'aurelia-framework';
import {ActorModel} from '../common/model';
import {NodeBase} from '../common/node-base';
import {SystemContextDiagram} from './system-context-diagram';

@transient()
export class ActorNode extends NodeBase {
    id: string;
    name: string;
    
    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
    
    updateFromModel(model: ActorModel): void {
        this.id = model.id;
        this.name = model.name;
        this.x = model.x;
        this.y = model.y;
        this.width = model.width;
        this.height = model.height;
    }
    
    copyToModel(): ActorModel {
        let model = <ActorModel>{};
        model.id = this.id;
        model.name = this.name;
        model.x = this.x;
        model.y = this.y;
        model.width = this.width;
        model.height = this.height;
        return model;
    }
}