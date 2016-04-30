import {NodeBase} from '../common/node-base';
import {ContainerNodeModel} from '../common/model';

export class ContainerNode extends NodeBase {
    id: string;
    name: string;
    description: string;

    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
    
    updateFromModel(model: ContainerNodeModel): void {
        this.id = model.id;
        this.name = model.name;
        this.x = model.x;
        this.y = model.y;
        this.width = model.width;
        this.height = model.height;
    }
    
    copyToModel(): ContainerNodeModel {
        let model = <ContainerNodeModel>{};
        model.id = this.id;
        model.name = this.name;
        model.x = this.x;
        model.y = this.y;
        model.width = this.width;
        model.height = this.height;
        return model;
    }
}
