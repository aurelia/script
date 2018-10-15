export class App {

  constructor() {
    this.message = 'Hello world';
  }

  configureRouter(config, router) {
    config.map([
      { route: '', moduleId: '/routes/home.js' }
    ])
    this.router = router;
  }
}