import { autoinject, Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DiagramBase } from '../common/diagram-base';
import { NodeBase } from '../common/node-base';
import { EdgeBase } from '../common/edge-base';
import { ContainerNode } from './container-node';
import { SelectionBox } from '../common/selection-box';
import { ContainerModel, SystemModel } from '../common/model';
import { SystemContextModelService } from "../services/system-context-model-service";
import { ModelSelectionChangedEventArgs } from '../nav-bar';

@autoinject
export class ContainerDiagram extends DiagramBase {
    id: string;
    name: string;
    private containerNodes: ContainerNode[];
    private diagramElement: SVGElement;

    constructor(private eventAggregator: EventAggregator,
        private container: Container,
        private systemContextModelService: SystemContextModelService) {
        super();
    };

    activate(params): void {
        let systemId = params.id;
        this.systemContextModelService.get().then(systemContext => {
            let system = systemContext.systems.find(system => system.id === systemId);
            this.updateFromModel(system);
            this.updateEdgePaths();

            let eventArgs = new ModelSelectionChangedEventArgs(systemContext, system);
            this.eventAggregator.publish("ModelSelectionChanged", eventArgs);
        });
    }

    getNodes(): NodeBase[] {
        let nodes = this.containerNodes;
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
