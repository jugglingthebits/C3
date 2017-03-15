import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SystemModel, ContainerModel } from './common/model';
import { SystemContextModelService } from './services/system-context-model-service';

@autoinject
export class NavBar {
    currentRouteConfigName: string;
    currentSystem: SystemModel = null;
    currentContainer: ContainerModel = null;

    constructor(private router: Router,
        private eventAggregator: EventAggregator,
        private systemContextModelService: SystemContextModelService) {

        eventAggregator.subscribe("DiagramSelectionChanged", (eventArgs: DiagramSelectionChangedEventArgs) => {
            this.currentSystem = eventArgs.system;
            this.currentContainer = eventArgs.container;
        });

        this.router.
    }

    attached() {
        this.currentRouteConfigName = this.router.currentInstruction.config.name;
    }
}

export class DiagramSelectionChangedEventArgs {
    constructor(public system: SystemModel,
        public container: ContainerModel = null) { }
}