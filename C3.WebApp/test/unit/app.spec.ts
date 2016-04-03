import {App} from '../../src/app';

class RouterStub {
  routes;
  
  configure(handler) {
    handler(this);
  }
  
  map(routes) {
    this.routes = routes;
  }
}

describe('the App module', () => {
  var sut, mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new App();
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('C3');
  });

  it('should have a container-diagram route', () => {
    expect(sut.router.routes).toContain({ route: ['','container-diagram'], name: 'container-diagram',  moduleId: 'container-diagram', nav: true, title:'Container Diagram' });
  });
});
