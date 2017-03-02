import { transient } from 'aurelia-framework';
import { NodeBase } from '../common/node-base';
import { ContainerModel } from '../common/model';

@transient()
export class ContainerNode extends NodeBase {
    id: string;
    description: string | null;

    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }

    updateFromModel(model: ContainerModel): void {
        this.id = model.id;
        this.description = model.description;
    }

    copyToModel(): ContainerModel {
        let model = <ContainerModel>{};
        model.id = this.id;
        model.description = this.description;
        return model;
    }
}
