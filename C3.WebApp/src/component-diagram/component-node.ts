import { transient } from 'aurelia-framework';
import { NodeBase } from '../common/node-base';
import { ComponentModel } from '../common/model';

@transient()
export class ComponentNode extends NodeBase {
    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }

    updateFromModel(model: ComponentModel): void {
        this.id = model.id;
    }

    copyToModel(): ComponentModel {
        let model = <ComponentModel>{};
        model.id = this.id;
        return model;
    }
}
