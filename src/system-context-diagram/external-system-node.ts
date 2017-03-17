import { transient } from 'aurelia-framework';
import { ContainerModel } from '../common/model';
import { NodeBase } from '../common/node-base';
import { SystemContextDiagram } from './system-context-diagram';

@transient()
export class ExternalSystemNode extends NodeBase {
    static width = 200;
    static height = 200;

    constructor() {
        super();
        this.width = ExternalSystemNode.width;
        this.height = ExternalSystemNode.height;
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
