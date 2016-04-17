import {autoinject} from 'aurelia-framework';
import {NodeBase} from 'node-base';
import {SystemNodeModel} from 'model';

@autoinject
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
