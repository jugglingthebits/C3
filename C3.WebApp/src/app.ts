import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
    router: Router;
    
    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'C3';
        config.map([
            { route: ['', 'overview'], name: 'overview', moduleId: 'overview/overview',
              nav: true, title: 'Overview' },
            { route: 'system-context-diagram/:id', name: 'system-context-diagram', 
              moduleId: 'system-context-diagram/system-context-diagram', title: 'System Context Diagram' },
            { route: 'system-context-diagram/:systemContextDiagramId/container-diagram/:id', name: 'container-diagram', 
              moduleId: 'container-diagram/container-diagram', title: 'Container Diagram' }
        ]);

        this.router = router;
    }
}
