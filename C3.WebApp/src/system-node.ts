import {autoinject} from 'aurelia-framework';
import {NodeBase} from 'node-base';

@autoinject
export class SystemNode extends NodeBase {
    name: string;
    description: string;
    isExternalSystem: boolean;
    
    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
}
