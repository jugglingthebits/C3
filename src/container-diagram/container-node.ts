import { transient } from 'aurelia-framework';
import { NodeBase } from '../common/node-base';
import { ContainerModel } from '../common/model';

@transient()
export class ContainerNode extends NodeBase {
    static width = 200;
    static height = 200;

    constructor() {
        super();
        this.width = ContainerNode.width;
        this.height = ContainerNode.height;
    }

    updateFromModel(model: ContainerModel): void {
        this.id = model.id;
    }

    copyToModel(): ContainerModel {
        let model = <ContainerModel>{};
        model.id = this.id;
        return model;
    }
}
