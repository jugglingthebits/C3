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
import { ExternalSystemNode } from "./external-system-node";

@autoinject
export class SystemContextDiagram extends DiagramBase {
    id: string;
    actorNodes: ActorNode[];
    systemNode: SystemNode;
    externalSystemNodes: ExternalSystemNode[];
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
        let systemNodeRowWidth = SystemNode.width;
        let externalSystemNodesRowWidth = this.externalSystemNodes.length * SystemNode.width + (this.externalSystemNodes.length - 1) * space;

        let maxRowWidth = Math.max(actorNodesRowWith, systemNodeRowWidth, externalSystemNodesRowWidth);

        var actorNodeX = Math.abs(middleX - actorNodesRowWith / 2);
        var y = 0;
        this.actorNodes.forEach(n => {
            n.x = actorNodeX;
            n.y = y;
            actorNodeX += ActorNode.width + space;
        });

        var systemNodeX = Math.abs(middleX - systemNodeRowWidth / 2);
        if (this.actorNodes.length > 0) {
            y += ActorNode.height + space;
        }
        this.systemNode.x = systemNodeX;
        this.systemNode.y = y;

        var externalSystemNodeX = Math.abs(middleX - externalSystemNodesRowWidth / 2);
        if (this.systemNode) {
            y += ExternalSystemNode.height + space;
        }
        this.externalSystemNodes.forEach(n => {
            n.x = externalSystemNodeX;
            n.y = y;
            externalSystemNodeX += ExternalSystemNode.width + space;
        });
    }

    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.actorNodes)
            .concat(<NodeBase>this.systemNode)
            .concat(<NodeBase[]>this.externalSystemNodes);
        return nodes;
    }

    getEdges(): EdgeBase[] {
        let edges = this.usingEdges;
        return edges;
    }

    updateFromModel(model: SystemContextModel): void {
        this.id = model.system.id;
        this.actorNodes = model.actors.map(actor => {
            let node = <ActorNode>this.container.get(ActorNode);
            node.updateFromModel(actor);
            return node;
        });
        let node = <SystemNode>this.container.get(SystemNode);
        node.updateFromModel(model.system);
        this.systemNode = node;
        this.externalSystemNodes = model.externalSystems.map(externalSystem => {
            let node = <ExternalSystemNode>this.container.get(ExternalSystemNode);
            node.updateFromModel(externalSystem);
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
        model.system.id = this.id;
        model.actors = this.actorNodes.map(node => node.copyToModel());
        model.system = this.systemNode.copyToModel();
        model.externalSystems = this.externalSystemNodes.map(node => node.copyToModel());
        model.usings = this.usingEdges.map(connector => connector.copyToModel());
        return model;
    }
}
