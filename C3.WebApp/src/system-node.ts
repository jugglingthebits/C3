import {autoinject} from 'aurelia-framework';
import {NodeBase} from 'node-base';

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
}
