import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SystemContextDiagramModel, SystemContextDiagramModelChanged} from 'common/model';
import {SystemContextDiagramService} from 'services/system-context-diagram-service'; 

@autoinject
export class NavBar {
    private systemContextDiagrams: SystemContextDiagramModel[] = [];
    private currentSystemContextDiagram: SystemContextDiagramModel;
    
    constructor(private router: Router, 
                private eventAggregator: EventAggregator,
                private systemContextDiagramService: SystemContextDiagramService) {
                    
        eventAggregator.subscribe("SystemContextDiagramModelChanged", diagram => {
            this.currentSystemContextDiagram = diagram;
        })
    }

    attached(): void {
        this.systemContextDiagrams = this.systemContextDiagramService.getAll();
    }
}