import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
// import 'fetch';
// import {HttpClient} from 'aurelia-fetch-client';
import {SystemContextModel} from '../common/model';
import {SystemContextModelService} from '../services/system-context-diagram-service'; 

@autoinject
export class Admin {
    private systemContextDiagrams: SystemContextModel[]; 
    
    constructor(private router: Router,
                private eventAggregator: EventAggregator, 
                private systemContextDiagramService: SystemContextModelService ) {
    }
    
    activate(): void {
        this.loadSystemContextDiagrams();
        this.eventAggregator.publish("SystemContextDiagramModelChanged", null);
    }
    
    
    private delete(): void {
        alert("Delete");
    }
    
    private loadSystemContextDiagrams() {
        this.systemContextDiagramService.getAll()
            .then(diagrams => {
                this.systemContextDiagrams = diagrams;
            });
        
        /*let httpClient = new HttpClient();
        httpClient.configure(config => config.withBaseUrl('api')
                                             .rejectErrorResponses());

        httpClient.fetch('/system')
            .then(response => <Promise<SystemContextDiagramModel[]>>response.json())
            .then(data => {
                this.systemContextDiagrams = data.map(m => {
                    let diagram = new SystemContextDiagram();
                    diagram.updateFromModel(m);
                    return diagram;
                });
            });*/
    }
}
