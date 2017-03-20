import { autoinject, Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DiagramBase } from '../common/diagram-base';
import { NodeBase } from '../common/node-base';
import { EdgeBase } from '../common/edge-base';
import { ContainerNode } from './container-node';
import { ContainerModel, SystemModel } from '../common/model';
import { ActorNode } from "../system-context-diagram/actor-node";
import { ExternalSystemNode } from "../system-context-diagram/external-system-node";
import { SystemNode } from "../system-context-diagram/system-node";
import { UsingEdge } from "../system-context-diagram/using-edge";
import { SystemModelService } from "../common/system-model-service";

@autoinject
export class ContainerDiagram extends DiagramBase {
    id: string;
    actorNodes: ActorNode[];
    containerNodes: ContainerNode[];
    externalSystemNodes: ExternalSystemNode[];
    usingEdges: UsingEdge[];
    diagramElement: SVGSVGElement;
    private loaded: Promise<void>;

    constructor(private eventAggregator: EventAggregator,
        private container: Container,
        private systemContextModelService: SystemModelService) {
        super();
    };

    activate(){
        this.loaded = this.systemContextModelService.get().then(system => {
            this.updateFromModel(system);
            this.eventAggregator.publish("DiagramSelectionChanged", "Container");
        });
    }

    attached(){
        this.loaded.then(() => {
            this.positionNodes();
            this.updateEdgePaths();
        });
    }

    private positionNodes() {
        const space = 150;

        let middleX = Math.abs(this.diagramElement.clientWidth / 2);

        let actorNodesRowWith = this.actorNodes.length * ActorNode.width + (this.actorNodes.length - 1) * space;
        let containerNodesRowWidth = this.containerNodes.length * ContainerNode.width + (this.containerNodes.length - 1) * space;
        let externalSystemNodesRowWidth = this.externalSystemNodes.length * ExternalSystemNode.width + (this.externalSystemNodes.length - 1) * space;

        var actorNodeX = Math.abs(middleX - actorNodesRowWith / 2) - Math.abs(middleX - actorNodesRowWith / 2) % 10;
        var y = 0;
        this.actorNodes.forEach(n => {
            n.x = actorNodeX;
            n.y = y;
            actorNodeX += ActorNode.width + space;
        });

        var containerNodeX = Math.abs(middleX - containerNodesRowWidth / 2) - Math.abs(middleX - containerNodesRowWidth / 2) % 10;
        if (this.actorNodes.length > 0) {
            y += ActorNode.height + space;
        }
        this.containerNodes.forEach(c => {
            c.x = containerNodeX;
            c.y = y;
            containerNodeX += ContainerNode.width + space;
        });

        var externalSystemNodeX = Math.abs(middleX - externalSystemNodesRowWidth / 2) - Math.abs(middleX - externalSystemNodesRowWidth / 2) % 10;
        if (this.containerNodes.length > 0) {
            y += ExternalSystemNode.height + space;
        }
        this.externalSystemNodes.forEach(n => {
            n.x = externalSystemNodeX;
            n.y = y;
            externalSystemNodeX += ExternalSystemNode.width + space;
        });
    }

    private allNodes: NodeBase[] = null;

    getNodes(): NodeBase[] {
        if (this.allNodes)
            return this.allNodes;

        this.allNodes = (<NodeBase[]>this.actorNodes)
            .concat(this.containerNodes)
            .concat(<NodeBase[]>this.externalSystemNodes);
        return this.allNodes;
    }

    getEdges(): EdgeBase[] {
        return this.usingEdges;
    }

    updateFromModel(systemModel: SystemModel): void {
        this.id = systemModel.id;
        this.actorNodes = systemModel.actors
            .filter(a => systemModel.usings.some(u => u.sourceId === a.id && 
                    systemModel.containers.some(c => u.targetId === c.id)))
            .map(a => {
                let node = <ActorNode>this.container.get(ActorNode);
                node.updateFromModel(a);
                return node;
            });
        this.containerNodes = systemModel.containers.map(container => {
            let node = <ContainerNode>this.container.get(ContainerNode);
            node.updateFromModel(container);
            return node;
        });
        this.externalSystemNodes = systemModel.externalSystems
            .filter(e => systemModel.usings.some(u => u.targetId === e.id &&
                systemModel.containers.some(c => u.sourceId === c.id)))
            .map(e => {
                let node = <ExternalSystemNode>this.container.get(ExternalSystemNode);
                node.updateFromModel(e);
                return node;
            });
        this.allNodes = null;
        this.usingEdges = systemModel.usings.map(using => {
                let connector = <UsingEdge>this.container.get(UsingEdge);
                connector.parentDiagram = this;
                connector.updateFromModel(using);
                return connector;
            });
    }

    //TODO
    copyToModel(): SystemModel {
        let model = <SystemModel>{};
        model.id = this.id;
        model.containers = this.containerNodes.map(node => node.copyToModel());
        return model;
    }
}
