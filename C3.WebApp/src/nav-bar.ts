import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SystemContextModel, SystemModel, ContainerModel } from './common/model';
import { SystemContextModelService } from './services/system-context-diagram-service';

@autoinject
export class NavBar {
    private currentSystemContext: SystemContextModel = null;
    private currentContainer: SystemModel = null;
    private currentComponent: ContainerModel = null;

    constructor(private router: Router,
        private eventAggregator: EventAggregator,
        private systemContextModelService: SystemContextModelService) {

        eventAggregator.subscribe("ModelSelectionChanged", (eventArgs: ModelSelectionChangedEventArgs) => {
            this.currentSystemContext = eventArgs.systemContext;
            this.currentContainer = eventArgs.system;
            this.currentComponent = eventArgs.container;
        });
    }
}

export class ModelSelectionChangedEventArgs {
    constructor(public systemContext: SystemContextModel,
        public system: SystemModel = null,
        public container: ContainerModel = null) { }
}