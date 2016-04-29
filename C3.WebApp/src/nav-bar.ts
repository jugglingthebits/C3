import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {SystemContextDiagramModel} from 'common/model';
import {SystemContextDiagramService} from 'services/system-context-diagram-service'; 

@autoinject
export class NavBar {
    private systemContextDiagrams: SystemContextDiagramModel[];
    
    constructor(private router: Router, 
                private systemContextDiagramService: SystemContextDiagramService) {
    }

    attached(): void {
        this.systemContextDiagrams = this.systemContextDiagramService.getAll();
    }
}