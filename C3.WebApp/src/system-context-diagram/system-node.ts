import { transient } from 'aurelia-framework';
import { SystemModel } from '../common/model';
import { NodeBase } from '../common/node-base';
import { SystemContextDiagram } from './system-context-diagram';

@transient()
export class SystemNode extends NodeBase {
    static width = 200;
    static height = 200;
    isExternal = false;

    constructor() {
        super();
        this.width = SystemNode.width;
        this.height = SystemNode.height;
    }

    updateFromModel(model: SystemModel): void {
        this.id = model.id;
        this.isExternal = model.isExternal;
    }

    copyToModel(): SystemModel {
        let model = <SystemModel>{};
        model.id = this.id;
        model.isExternal = this.isExternal;
        return model;
    }
}
