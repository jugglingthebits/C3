import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SystemContextDiagramModel, ContainerDiagramModel} from 'common/model';
import {SystemContextDiagramService, ContainerDiagramService} from 'services/diagram-services'; 

@autoinject
export class NavBar {
    private systemContextDiagrams: SystemContextDiagramModel[] = [];
    private currentSystemContextDiagram: SystemContextDiagramModel = null;

    private containerDiagrams: ContainerDiagramModel[] = [];
    private currentContainerDiagram: ContainerDiagramModel = null;
    
    constructor(private router: Router, 
                private eventAggregator: EventAggregator,
                private systemContextDiagramService: SystemContextDiagramService,
                private containerDiagramService: ContainerDiagramService) {
                    
        eventAggregator.subscribe("SystemContextDiagramModelChanged", (model: SystemContextDiagramModel) => {
            this.currentSystemContextDiagram = model;
            this.currentContainerDiagram = null;
        });
        eventAggregator.subscribe("ContainerDiagramModelChanged", (model: ContainerDiagramModel) => {
            this.currentContainerDiagram = model;
        });
    }

    attached(): void {
        this.systemContextDiagramService.getAll()
            .then(diagrams => {
                this.systemContextDiagrams = diagrams;
            });
        this.containerDiagramService.getAll()
            .then(diagrams => {
                this.containerDiagrams = diagrams;
            });
    }
}