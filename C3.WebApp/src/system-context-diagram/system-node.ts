import { transient } from 'aurelia-framework';
import { SystemModel } from '../common/model';
import { NodeBase } from '../common/node-base';
import { SystemContextDiagram } from './system-context-diagram';

@transient()
export class SystemNode extends NodeBase {
    id: string;
    name: string;
    description: string;
    isExternalSystem = false;
    containerDiagramId: string;

    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }

    updateFromModel(model: SystemModel): void {
        this.id = model.id;
        this.isExternalSystem = model.isExternal;
    }

    copyToModel(): SystemModel {
        let model = <SystemModel>{};
        model.id = this.id;
        model.isExternal = this.isExternalSystem;
        return model;
    }
}
