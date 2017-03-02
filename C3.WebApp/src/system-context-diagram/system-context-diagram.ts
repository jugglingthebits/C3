import { autoinject, Container } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SystemNode } from './system-node';
import { ActorNode } from './actor-node';
import { SystemActorEdge } from './system-actor-edge';
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
    actorSystemUsingEdges: SystemActorEdge[];

    private diagramElement: SVGElement;

    constructor(private eventAggregator: EventAggregator,
        private router: Router,
        private container: Container,
        private systemContextModelService: SystemContextModelService) {
        super();
    }

    activate(): void {
        this.systemContextModelService.get().then(systemContext => {
            this.updateFromModel(systemContext);
            this.updateEdgePaths();

            let eventArgs = new ModelSelectionChangedEventArgs(systemContext);
            this.eventAggregator.publish("ModelSelectionChanged", eventArgs);
        });
    }

    getNodes(): NodeBase[] {
        let nodes = (<NodeBase[]>this.systemNodes)
            .concat(<NodeBase[]>this.actorNodes);
        return nodes;
    }

    getEdges(): EdgeBase[] {
        let edges = this.actorSystemUsingEdges;
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
        this.actorSystemUsingEdges = model.actorSystemUsings.map(actorSystemUsing => {
            let connector = <SystemActorEdge>this.container.get(SystemActorEdge);
            connector.parentDiagram = this;
            connector.updateFromModel(actorSystemUsing);
            return connector;
        });
    }

    copyToModel(): SystemContextModel {
        let model = <SystemContextModel>{};
        model.id = this.id;
        model.actors = this.actorNodes.map(node => node.copyToModel());
        model.systems = this.systemNodes.map(node => node.copyToModel());
        model.actorSystemUsings = this.actorSystemUsingEdges.map(connector => connector.copyToModel());
        return model;
    }
}
