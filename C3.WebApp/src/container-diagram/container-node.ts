import { transient } from 'aurelia-framework';
import {NodeBase} from '../common/node-base';
import {Container} from '../common/model';

@transient()
export class ContainerNode extends NodeBase {
    id: string;
    name: string;
    description: string;
    componentDiagramId: string;

    constructor() {
        super();
        this.width = 200;
        this.height = 200;
    }
    
    updateFromModel(model: Container): void {
        this.id = model.id;
        this.name = model.name;
        this.x = model.x;
        this.y = model.y;
        this.width = model.width;
        this.height = model.height;
        this.componentDiagramId = model.componentDiagramId;
    }
    
    copyToModel(): Container {
        let model = <Container>{};
        model.id = this.id;
        model.name = this.name;
        model.x = this.x;
        model.y = this.y;
        model.width = this.width;
        model.height = this.height;
        model.componentDiagramId = this.componentDiagramId;
        return model;
    }
}
