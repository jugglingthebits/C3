import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import { SystemContextDiagram, ContainerDiagram, ComponentDiagramModel } from './common/model';
import {SystemContextModelService} from './services/system-context-diagram-service'; 
import {ContainerDiagramService} from './services/container-diagram-service'; 

@autoinject
export class NavBar {
    private systemContextDiagrams: SystemContextDiagram[] = [];
    private currentSystemContextDiagram: SystemContextDiagram = null;

    private containerDiagrams: ContainerDiagram[] = [];
    private currentContainerDiagram: ContainerDiagram = null;

    private componentDiagrams: ComponentDiagramModel[] = [];
    private currentComponentDiagram: ComponentDiagramModel = null;
    
    constructor(private router: Router, 
                private eventAggregator: EventAggregator,
                private systemContextDiagramService: SystemContextModelService,
                private containerDiagramService: ContainerDiagramService) {
                    
        eventAggregator.subscribe("DiagramModelChanged", (eventArgs: DiagramModelChangedEventArgs) => {
            this.currentSystemContextDiagram = eventArgs.systemContextDiagramModel;
            this.currentContainerDiagram = eventArgs.containerDiagramModel; ==
            this.currentComponentDiagram = eventArgs.componentDiagramModel;
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

export class DiagramModelChangedEventArgs {
    constructor(public systemContextDiagramModel: SystemContextDiagram,
                public containerDiagramModel: ContainerDiagram = null,
                public componentDiagramModel: ComponentDiagramModel = null) {}
}