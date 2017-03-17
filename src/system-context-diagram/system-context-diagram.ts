import { autoinject, Container, bindable, computedFrom, bindingMode } from 'aurelia-framework';
import { BindingSignaler, SignalBindingBehavior } from 'aurelia-templating-resources';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SystemNode } from './system-node';
import { ActorNode } from './actor-node';
import { UsingEdge } from './using-edge';
import { DiagramBase } from '../common/diagram-base';
import { NodeBase } from '../common/node-base';
import { EdgeBase } from '../common/edge-base';
import { SystemContextModelService } from '../services/system-context-model-service';
import { DiagramSelectionChangedEventArgs } from '../nav-bar';
import { ExternalSystemNode } from "./external-system-node";
import { SystemModel, EdgeModel } from "../common/model";

@autoinject
export class SystemContextDiagram extends DiagramBase {
    id: string;
    actorNodes: ActorNode[] = [];
    systemNode: SystemNode = null;
    externalSystemNodes: ExternalSystemNode[] = [];
    usingEdges: UsingEdge[] = [];
    private diagramElement: SVGElement;

    constructor(private eventAggregator: EventAggregator,
        private router: Router,
        private container: Container,
        private systemContextModelService: SystemContextModelService,
        private bindingSignaler: BindingSignaler) {
        super();
    }

    attached(): void {
        this.systemContextModelService.get().then(system => {
            this.updateFromModel(system);
            this.positionNodes();
            this.updateEdgePaths();

            this.bindingSignaler.signal('diagramLoaded');
            let eventArgs = new DiagramSelectionChangedEventArgs("SystemContext");
            this.eventAggregator.publish("DiagramSelectionChanged", eventArgs);
        });
    }

    get style() {
        let boundingBox = this.getBoundingBox();
        return {
            height: `${boundingBox.height}px`
        }
    }

    private positionNodes() {
        const space = 150;

        let middleX = Math.abs(this.diagramElement.clientWidth / 2);

        let actorNodesRowWith = this.actorNodes.length * ActorNode.width + (this.actorNodes.length - 1) * space;
        let systemNodeRowWidth = SystemNode.width;
        let externalSystemNodesRowWidth = this.externalSystemNodes.length * SystemNode.width + (this.externalSystemNodes.length - 1) * space;

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
            .concat(<NodeBase>this.systemNode ? [<NodeBase>this.systemNode] : [])
            .concat(<NodeBase[]>this.externalSystemNodes);
        return nodes;
    }

    getEdges(): EdgeBase[] {
        let edges = this.usingEdges;
        return edges;
    }

    updateFromModel(systemModel: SystemModel): void {
        this.id = systemModel.id;
        this.actorNodes = systemModel.actors.map(actor => {
            let node = <ActorNode>this.container.get(ActorNode);
            node.updateFromModel(actor);
            return node;
        });
        let node = <SystemNode>this.container.get(SystemNode);
        node.updateFromModel(systemModel);
        this.systemNode = node;
        this.externalSystemNodes = systemModel.externalSystems.map(externalSystem => {
            let node = <ExternalSystemNode>this.container.get(ExternalSystemNode);
            node.updateFromModel(externalSystem);
            return node;
        });
        this.usingEdges = systemModel.usings
            .map((using) => {
                let sourceId = systemModel.actors.some(a => a.id === using.sourceId) ? using.sourceId : systemModel.id;
                let targetId = systemModel.externalSystems.some(e => e.id === using.targetId) ? using.targetId : systemModel.id;
                return <EdgeModel>{
                    sourceId: sourceId,
                    targetId: targetId
                };
            }).filter((using, index, array) => {
                let copies = array.filter(u => u.sourceId === using.sourceId && u.targetId === using.targetId);
                if (copies.length === 1)
                    return true;
                return array.indexOf(copies[0]) === index;
            }).map(using => {
                let connector = <UsingEdge>this.container.get(UsingEdge);
                    connector.parentDiagram = this;
                    connector.updateFromModel(using);
                return connector;
            });
    }

    //TODO
    copyToModel(): SystemModel {
        let systemModel = this.systemNode.copyToModel();
        systemModel.actors = this.actorNodes.map(node => node.copyToModel());
        systemModel.externalSystems = this.externalSystemNodes.map(node => node.copyToModel());
        systemModel.usings = this.usingEdges.map(connector => connector.copyToModel());
        return systemModel;
    }
}
