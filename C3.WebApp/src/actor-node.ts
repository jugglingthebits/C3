import {NodeBase} from 'node-base';
import {ActorNodeModel} from 'model';

export class ActorNode extends NodeBase {
    id: string;
    name: string;
    
    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
    
    updateFromModel(model: ActorNodeModel): void {
        this.id = model.id;
        this.name = model.name;
    }
    
    copyToModel(): ActorNodeModel {
        let model = <ActorNodeModel>{};
        model.id = this.id;
        model.name = this.name;
        return model;
    }
}