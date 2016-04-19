import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import 'fetch';
import {HttpClient} from 'aurelia-fetch-client';
import {SystemContextDiagram} from '../system-context-diagram/system-context-diagram';
import {SystemContextDiagramModel} from '../common/model';

@autoinject
export class Overview {
    private systemContextDiagrams: SystemContextDiagram[]; 
    
    constructor(private router: Router) {
        this.generateSystemContextDiagrams();
    }
    
    activate(): void {
        this.loadSystemContextDiagrams();
    }
    
    private generateSystemContextDiagrams() {
        let diagram1 = new SystemContextDiagram();
        diagram1.id = "system 1";
        diagram1.name = "system 1";
        let diagram2 = new SystemContextDiagram();
        diagram2.id = "some_other_system";
        diagram2.name = "Some other system";
        this.systemContextDiagrams = [diagram1, diagram2];
    }
    
    private delete(): void {
        //TODO
    }
    
    private loadSystemContextDiagrams() {
        let httpClient = new HttpClient();
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
            });
    }
}
