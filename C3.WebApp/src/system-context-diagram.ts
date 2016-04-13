import {autoinject} from 'aurelia-framework';
import {SystemNode} from './system-node';
import {ActorNode} from './actor-node';
import {DiagramBase} from './diagram-base';
import {NodeBase} from './node-base';

@autoinject
export class SystemContextDiagram extends DiagramBase {
    id: string;
    name: string;

    private actorNodes: ActorNode[];    
    private systemNodes: SystemNode[];
    private systemContextDiagramElement: SVGElement;
    
    constructor() {
        super();
        this.name = 'system 1';
        
        this.createExampleNodes();
    }
    
    private createExampleNodes() {
        let systemNode1 = new SystemNode();
        systemNode1.name = "system 1"
        systemNode1.x = 20;
        systemNode1.y = 20;
        
        let actorNode1 = new ActorNode();
        actorNode1.x = 100;
        actorNode1.y = 100;
        actorNode1.name = "actor 1";
        
        this.systemNodes = [systemNode1];
        this.actorNodes = [actorNode1];
    }
    
    attached(): void {
        this.attachHammerEventHandler(this.systemContextDiagramElement);
    }
    
    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.systemNodes)
             .concat(<NodeBase[]>this.actorNodes);
        return nodes;
    }
}
