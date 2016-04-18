import {NodeBase} from '../common/node-base';

export class ActorNode extends NodeBase {
    name: string;
    description: string;
    
    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
}