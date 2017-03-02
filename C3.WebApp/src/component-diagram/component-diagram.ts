import { autoinject, Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DiagramBase } from '../common/diagram-base';
import { NodeBase } from '../common/node-base';
import { EdgeBase } from '../common/edge-base';
import { ComponentNode } from './component-node';
import { SelectionBox } from '../common/selection-box';
import { ComponentModel, ContainerModel } from '../common/model';
import { SystemContextModelService } from '../services/system-context-model-service';
import { ModelSelectionChangedEventArgs } from "../nav-bar";

@autoinject
export class ComponentDiagram extends DiagramBase {
    id: string;
    name: string;
    private componentNodes: ComponentNode[];
    private diagramElement: SVGElement;

    constructor(private eventAggregator: EventAggregator,
        private container: Container,
        private systemContextModelService: SystemContextModelService) {
        super();
    }

    activate(params): void {
        let systemId = params.systemId;
        let containerId = params.containerId;
        this.systemContextModelService.get().then(systemContext => {
            let system = systemContext.systems.find(m => m.id === params.systemId);
            let container = system.containers.find(m => m.id === params.id);
            this.updateFromModel(container);
            this.updateEdgePaths();

            let eventArgs = new ModelSelectionChangedEventArgs(systemContext, system, container);
            this.eventAggregator.publish('ModelSelectionChanged', eventArgs);
        });
    }

    getNodes(): NodeBase[] {
        let nodes = this.componentNodes;
        return nodes;
    }

    getEdges(): EdgeBase[] {
        return [];
    }

    updateFromModel(model: ContainerModel): void {
        this.id = model.id;
        this.componentNodes = model.components.map(component => {
            let node = <ComponentNode>this.container.get(ComponentNode);
            node.updateFromModel(component);
            return node;
        });
    }

    copyToModel(): ContainerModel {
        let model = <ContainerModel>{};
        model.id = this.id;
        model.components = this.componentNodes.map(node => node.copyToModel());
        return model;
    }
}
