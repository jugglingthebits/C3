import {autoinject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {SystemContextDiagram} from './system-context-diagram';

@autoinject
export class Overview {
    private systemContextDiagrams: SystemContextDiagram[]; 
    
    constructor(private router: Router) {
        this.generateSystemContextDiagrams();
    }
    
    private generateSystemContextDiagrams() {
        let diagram1 = new SystemContextDiagram();
        diagram1.id = "scook";
        diagram1.name = "scook";
        let diagram2 = new SystemContextDiagram();
        diagram2.id = "some_other_system";
        diagram2.name = "Some other system";
        this.systemContextDiagrams = [diagram1, diagram2];
    }
}
