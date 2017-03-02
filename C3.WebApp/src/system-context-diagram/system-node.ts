import {transient} from 'aurelia-framework';
import {System} from '../common/model';
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
    
    updateFromModel(model: System): void {
        this.id = model.id;
        this.name = model.name;
        this.x = model.x;
        this.y = model.y;
        this.width = model.width;
        this.height = model.height;
        this.isExternalSystem = model.isExternal;
        this.containerDiagramId = model.containerDiagramId;
    }
    
    copyToModel(): System {
        let model = <System>{};
        model.id = this.id;
        model.name = this.name;
        model.x = this.x;
        model.y = this.y;
        model.width = this.width;
        model.height = this.height;
        model.isExternal = this.isExternalSystem;
        model.containerDiagramId = this.containerDiagramId;
        return model;
    }
}
