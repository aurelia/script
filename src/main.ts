export function configure(aurelia) {
  aurelia.use.basicConfiguration();
  aurelia.start().then(() => aurelia.setRoot());
}
