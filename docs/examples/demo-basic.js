import template from './demo-basic.html';
import countries from './fixtures/countries';

class BasicExample {
  constructor() {
    this.country = {};
    this.multipleDemo = {
      countries: []
    };
  }

  $onInit() {
    this.countries = countries;
  }
}

const component = {
  template: template,
  controller: BasicExample
};

export default component;
