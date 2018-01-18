import chalk from 'chalk';

import localConfig from 'modules/local-config';

export default class SetRoute {

  constructor() {
    console.log('unset config');
    localConfig.unset();
  }

}
