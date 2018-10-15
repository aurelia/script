export class Page {
  static get $view() {
    return '<template>${message}</template>'
  }

  constructor() {
    this.message = 'Page 1';
  }
}