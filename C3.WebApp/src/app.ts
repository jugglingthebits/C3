import {Router, RouterConfiguration} from 'aurelia-router';		
		
export class App {
    router: Router;
    		
    configureRouter(config: RouterConfiguration, router: Router) {		
        config.title = 'C3';		
        config.map([		
            { route: ['', 'system-context-diagram/:id'], name: 'system-context-diagram', 		
              moduleId: 'system-context-diagram/system-context-diagram', title: 'System Context Diagram' },		
            { route: 'container-diagram/:id', name: 'container-diagram', 		
              moduleId: 'container-diagram/container-diagram', title: 'Container Diagram' },		
            { route: 'component-diagram/:id', name: 'component-diagram', 		
              moduleId: 'component-diagram/component-diagram', title: 'Component Diagram' },		
            { route: 'admin', name: 'admin', moduleId: 'admin/admin',		
              nav: true, title: 'Admin' }		
        ]);		
		
        this.router = router;		
    }		
}