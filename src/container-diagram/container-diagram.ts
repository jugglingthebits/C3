import { autoinject, Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DiagramBase } from '../common/diagram-base';
import { NodeBase } from '../common/node-base';
import { EdgeBase } from '../common/edge-base';
import { ContainerNode } from './container-node';
import { ContainerModel, SystemModel } from '../common/model';
import { SystemContextModelService } from "../services/system-context-model-service";
import { ModelSelectionChangedEventArgs } from '../nav-bar';
import { ActorNode } from "../system-context-diagram/actor-node";
import { ExternalSystemNode } from "../system-context-diagram/external-system-node";

@autoinject
export class ContainerDiagram extends DiagramBase {
    id: string;
    actorNodes: ActorNode[];
    containerNodes: ContainerNode[];
    externalSystemNodes: ExternalSystemNode[];
    private diagramElement: SVGElement;

    constructor(private eventAggregator: EventAggregator,
        private container: Container,
        private systemContextModelService: SystemContextModelService) {
        super();
    };

    activate(params): void {
        let systemId = params.id;
        this.systemContextModelService.get().then(systemContext => {
            let system = systemContext.system;
            this.updateFromModel(systemContext.system);
            this.updateEdgePaths();
            this.positionNodes();

            let eventArgs = new ModelSelectionChangedEventArgs(systemContext, system);
            this.eventAggregator.publish("ModelSelectionChanged", eventArgs);
        });
    }

    private positionNodes() {
        var x = 0, y = 0;
        this.containerNodes.forEach(n => {
            n.x = x; 
            n.y = y; 
            x += 300; 
            y += 300; 
        }); //TODO: Auto positioning
    }

    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.actorNodes)
            .concat(this.containerNodes)
            .concat(<NodeBase[]>this.externalSystemNodes);
        return nodes;
    }

    getEdges(): EdgeBase[] {
        return [];
    }

    updateFromModel(model: SystemModel): void {
        this.id = model.id;
        this.containerNodes = model.containers.map(container => {
            let node = <ContainerNode>this.container.get(ContainerNode);
            node.updateFromModel(container);
            return node;
        });
    }

    copyToModel(): SystemModel {
        let model = <SystemModel>{};
        model.id = this.id;
        model.containers = this.containerNodes.map(node => node.copyToModel());
        return model;
    }
}
