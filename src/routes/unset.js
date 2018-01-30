import localConfig from 'modules/local-config';

export default class SetRoute {

  constructor() {
    localConfig.unset();
  }

}
