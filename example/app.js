export class App {

  constructor() {
    this.message = 'Hello world';
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'routes/home.js', title: 'Home', nav: true },
      { route: 'contact', name: 'contact', moduleId: 'routes/contact.js', title: 'Contact', nav: true }
    ]);
    this.router = router;
  }
}