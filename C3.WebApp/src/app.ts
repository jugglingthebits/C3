import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'C3';
    config.map([
      { route: ['', 'containers'], name: 'containers', moduleId: 'containers', nav: true, title: 'Containers'}
    ]);

    this.router = router;
  }
}
