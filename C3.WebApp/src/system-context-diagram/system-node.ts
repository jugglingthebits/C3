import {autoinject} from 'aurelia-framework';
import {SystemNodeModel} from '../common/model';
import {NodeBase} from '../common/node-base';

export class SystemNode extends NodeBase {
    id: string;
    name: string;
    description: string;
    isExternalSystem = false;
    
    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
    
    updateFromModel(model: SystemNodeModel): void {
        this.id = model.id;
        this.name = model.name;
        this.isExternalSystem = model.isExternalSystem;
    }
    
    copyToModel(): SystemNodeModel {
        let model = <SystemNodeModel>{};
        model.id = this.id;
        model.name = this.name;
        model.isExternalSystem = this.isExternalSystem;
        return model;
    }
}
