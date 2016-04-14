import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'C3';
        config.map([
        { route: ['', 'overview'], name: 'overview', moduleId: 'overview',
          nav: true, title: 'Overview' },
        { route: 'system-context-diagram/:id', name: 'system-context-diagram', moduleId: 'system-context-diagram', 
          href: '#' /* TODO: why is this needed? */, nav: true, title: 'System Context Diagram' },
        { route: 'container-diagram/:id', name: 'container-diagram', moduleId: 'container-diagram', 
          href: '#' /* TODO: why is this needed? */, nav: true, title: 'Container Diagram' }
        ]);

        this.router = router;
    }
}
