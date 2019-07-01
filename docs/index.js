import angular from 'angular';
import angularSanitize from 'angular-sanitize';
import uiSelect from '../dist/select';

import './docs.scss';

import demoBasic from './examples/demo-basic';
import propsFilter from './props.filter';

angular
  .module('ui.select.docs', [uiSelect, angularSanitize])
  .filter('propsFilter', propsFilter)
  .component('demoBasic', demoBasic);
