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
                    
        eventAggregator.subscribe("SystemContextDiagramModelChanged", (id: string) => {
            this.currentSystemContextDiagram = this.systemContextDiagrams.find(d => d.id === id);
            this.currentContainerDiagram = null;
        });
        eventAggregator.subscribe("ContainerDiagramModelChanged", (id: string) => {
            this.currentContainerDiagram = this.containerDiagrams.find(d => d.id === id);
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