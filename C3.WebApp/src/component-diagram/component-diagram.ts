import { autoinject, Container } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DiagramBase } from '../common/diagram-base';
import { NodeBase } from '../common/node-base';
import { EdgeBase } from '../common/edge-base';
import { ComponentNode } from './component-node';
import { ComponentModel, ContainerModel } from '../common/model';
import { SystemContextModelService } from '../services/system-context-model-service';
import { ModelSelectionChangedEventArgs } from "../nav-bar";

function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
    return [].concat(...array.map(callbackfn));
}

@autoinject
export class ComponentDiagram extends DiagramBase {
    id: string;
    private componentNodes: ComponentNode[];
    private diagramElement: SVGElement;

    constructor(private eventAggregator: EventAggregator,
        private container: Container,
        private systemContextModelService: SystemContextModelService) {
        super();
    }

    activate(params): void {
        let containerId = params.id;
        this.systemContextModelService.get().then(systemContext => {
            let system = systemContext.system;
            let container = system.containers.find(m => m.id === containerId);
            this.updateFromModel(container);
            this.updateEdgePaths();
            this.positionNodes();

            let eventArgs = new ModelSelectionChangedEventArgs(systemContext, system, container);
            this.eventAggregator.publish('ModelSelectionChanged', eventArgs);
        });
    }

    private positionNodes() {
        var x = 0, y = 0;
        this.componentNodes.forEach(n => {
            n.x = x; 
            n.y = y; 
            x += 300; 
            y += 300; }); //TODO: Auto positioning
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
