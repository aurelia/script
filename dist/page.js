export class Page {
  static get $view1() {
    return '<template>${message}</template>'
  }

  constructor() {
    this.message = 'Page 1';
  }
}