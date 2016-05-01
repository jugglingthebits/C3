import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {SystemContextDiagramModel} from '../common/model';
import {SystemContextDiagramService} from '../services/diagram-services'; 

@autoinject
export class Admin {
    private systemContextDiagrams: SystemContextDiagramModel[]; 
    
    constructor(private router: Router, private systemContextDiagramService: SystemContextDiagramService ) {
    }
    
    activate(): void {
        // TODO
        this.loadSystemContextDiagrams();
    }
    
    
    private delete(): void {
        //TODO
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
