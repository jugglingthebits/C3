import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class NavBar {
    currentDiagramType: string;

    constructor(private router: Router,
        private eventAggregator: EventAggregator) {

        eventAggregator.subscribe("DiagramSelectionChanged", (diagramType: string) => {
            this.currentDiagramType = diagramType;
        });
    }
}
