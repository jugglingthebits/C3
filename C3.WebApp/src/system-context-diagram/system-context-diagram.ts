import { autoinject, Container } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SystemNode } from './system-node';
import { ActorNode } from './actor-node';
import { UsingEdge } from './using-edge';
import { SystemContextModel } from '../common/model';
import { DiagramBase } from '../common/diagram-base';
import { NodeBase } from '../common/node-base';
import { EdgeBase } from '../common/edge-base';
import { SystemContextModelService } from '../services/system-context-model-service';
import { ModelSelectionChangedEventArgs } from '../nav-bar';

@autoinject
export class SystemContextDiagram extends DiagramBase {
    id: string;
    actorNodes: ActorNode[];
    systemNodes: SystemNode[];
    usingEdges: UsingEdge[];

    private diagramElement: SVGElement;

    constructor(private eventAggregator: EventAggregator,
        private router: Router,
        private container: Container,
        private systemContextModelService: SystemContextModelService) {
        super();
    }

    attached(): void {
        this.systemContextModelService.get().then(systemContext => {
            this.updateFromModel(systemContext);
            this.positionNodes();
            this.updateEdgePaths();

            let eventArgs = new ModelSelectionChangedEventArgs(systemContext);
            this.eventAggregator.publish("ModelSelectionChanged", eventArgs);
        });
    }

    private positionNodes() {
        const space = 50;

        let middleX = Math.abs(this.diagramElement.clientWidth / 2);

        let actorNodesRowWith = this.actorNodes.length * ActorNode.width + (this.actorNodes.length - 1) * space;
        let internalSystemNodesRowWidth = this.systemNodes.filter(n => !n.isExternal).length * SystemNode.width + (this.systemNodes.filter(n => !n.isExternal).length - 1) * space;
        let externalSystemNodesRowWidth = this.systemNodes.filter(n => n.isExternal).length * SystemNode.width + (this.systemNodes.filter(n => n.isExternal).length - 1) * space;

        let maxRowWidth = Math.max(actorNodesRowWith, internalSystemNodesRowWidth, externalSystemNodesRowWidth);

        var actorNodeX = Math.abs(middleX - actorNodesRowWith / 2);
        var y = 0;
        this.actorNodes.forEach(n => {
            n.x = actorNodeX;
            n.y = y;
            actorNodeX += ActorNode.width + space;
        });

        var internalSystemNodeX = Math.abs(middleX - internalSystemNodesRowWidth / 2);
        if (this.actorNodes.length > 0) {
            y += ActorNode.height + space;
        }
        this.systemNodes.filter(n => !n.isExternal).forEach(n => {
            n.x = internalSystemNodeX;
            n.y = y;
            internalSystemNodeX += SystemNode.width + space;
        });

        var externalSystemNodeX = Math.abs(middleX - externalSystemNodesRowWidth / 2);
        if (this.systemNodes.filter(n => !n.isExternal).length > 0) {
            y += this.systemNodes.filter(n => !n.isExternal)[0].height + space;
        }
        this.systemNodes.filter(n => n.isExternal).forEach(n => {
            n.x = externalSystemNodeX;
            n.y = y;
            externalSystemNodeX += SystemNode.width + space;
        });
    }

    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.systemNodes)
            .concat(<NodeBase[]>this.actorNodes);
        return nodes;
    }

    getEdges(): EdgeBase[] {
        let edges = this.usingEdges;
        return edges;
    }

    updateFromModel(model: SystemContextModel): void {
        this.id = model.id;
        this.actorNodes = model.actors.map(actor => {
            let node = <ActorNode>this.container.get(ActorNode);
            node.updateFromModel(actor);
            return node;
        });
        this.systemNodes = model.systems.map(system => {
            let node = <SystemNode>this.container.get(SystemNode);
            node.updateFromModel(system);
            return node;
        });
        this.usingEdges = model.usings.map(using => {
            let connector = <UsingEdge>this.container.get(UsingEdge);
            connector.parentDiagram = this;
            connector.updateFromModel(using);
            return connector;
        });
    }

    copyToModel(): SystemContextModel {
        let model = <SystemContextModel>{};
        model.id = this.id;
        model.actors = this.actorNodes.map(node => node.copyToModel());
        model.systems = this.systemNodes.map(node => node.copyToModel());
        model.usings = this.usingEdges.map(connector => connector.copyToModel());
        return model;
    }
}
