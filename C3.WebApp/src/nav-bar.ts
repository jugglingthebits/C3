import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SystemContextDiagramModel, ContainerDiagramModel} from 'common/model';
import {SystemContextDiagramService, ContainerDiagramService} from 'services/diagram-services'; 

@autoinject
export class NavBar {
    private systemContextDiagrams: SystemContextDiagramModel[] = [];
    private currentSystemContextDiagram: SystemContextDiagramModel;

    private containerDiagrams: ContainerDiagramModel[] = [];
    private currentContainerDiagram: ContainerDiagramModel;
    
    constructor(private router: Router, 
                private eventAggregator: EventAggregator,
                private systemContextDiagramService: SystemContextDiagramService,
                private containerDiagramService: ContainerDiagramService) {
                    
        eventAggregator.subscribe("SystemContextDiagramModelChanged", (diagram: SystemContextDiagramModel) => {
            this.currentSystemContextDiagram = diagram;
        });
        eventAggregator.subscribe("ContainerDiagramModelChanged", (diagram: ContainerDiagramModel) => {
            this.currentContainerDiagram = diagram;
        });
    }

    attached(): void {
        this.systemContextDiagrams = this.systemContextDiagramService.getAll();
        this.containerDiagrams = this.containerDiagramService.getAll();
    }
}