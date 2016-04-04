import {autoinject} from 'aurelia-framework';
import {NodeBase} from 'node-base';

@autoinject
export class ContainerNode extends NodeBase {
    name: string;
    description: string;

    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
}
