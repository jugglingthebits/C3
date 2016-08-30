import {transient} from 'aurelia-framework';
import {SystemNodeModel} from '../common/model';
import {NodeBase} from '../common/node-base';
import {SystemContextDiagram} from './system-context-diagram';

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
    
    updateFromModel(model: SystemNodeModel): void {
        this.id = model.id;
        this.name = model.name;
        this.x = model.x;
        this.y = model.y;
        this.width = model.width;
        this.height = model.height;
        this.isExternalSystem = model.isExternalSystem;
        this.containerDiagramId = model.containerDiagramId;
    }
    
    copyToModel(): SystemNodeModel {
        let model = <SystemNodeModel>{};
        model.id = this.id;
        model.name = this.name;
        model.x = this.x;
        model.y = this.y;
        model.width = this.width;
        model.height = this.height;
        model.isExternalSystem = this.isExternalSystem;
        model.containerDiagramId = this.containerDiagramId;
        return model;
    }
}
