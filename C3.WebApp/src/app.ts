import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'C3';
    config.map([
      { route: ['', 'container-diagram'], name: 'container-diagram', moduleId: 'container-diagram', nav: true, title: 'Container Diagram'}
    ]);

    this.router = router;
  }
}
