import { transient } from 'aurelia-framework';
import { SystemModel } from '../common/model';
import { NodeBase } from '../common/node-base';
import { SystemContextDiagram } from './system-context-diagram';

@transient()
export class SystemNode extends NodeBase {
    static width = 200;
    static height = 200;

    constructor() {
        super();
        this.width = SystemNode.width;
        this.height = SystemNode.height;
    }

    updateFromModel(model: SystemModel): void {
        this.id = model.id;
    }

    copyToModel(): SystemModel {
        let model = <SystemModel>{};
        model.id = this.id;
        return model;
    }
}
