import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SystemModel, ContainerModel } from './common/model';
import { SystemContextModelService } from './services/system-context-model-service';

@autoinject
export class NavBar {
    currentDiagramType: string;
    currentContainer: ContainerModel = null;

    constructor(private router: Router,
        private eventAggregator: EventAggregator,
        private systemContextModelService: SystemContextModelService) {

        eventAggregator.subscribe("DiagramSelectionChanged", (eventArgs: DiagramSelectionChangedEventArgs) => {
            this.currentDiagramType = eventArgs.diagramType;
            this.currentContainer = eventArgs.container;
        });
    }
}

export class DiagramSelectionChangedEventArgs {
    constructor(public diagramType: string, public container: ContainerModel = null) { }
}