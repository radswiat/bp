import chalk from 'chalk';

import argv from 'helpers/argv';
import localConfig from 'modules/local-config';

export default class SetRoute {

  static parseHelpLine([action, description, example]) {
    return [
      chalk.yellowBright(action),
      chalk.gray(description),
      chalk.gray(example),
    ];
  }

  constructor() {
    // action: SET
    if (argv.getAction() === 'set') {
      if (argv.argv[1] === 'config') {
        this.setConfig();
      }
    }
  }

  async setConfig() {
    await localConfig.setConfig(argv.argv[2]);
    console.log(chalk.greenBright('your config has been set'));
    process.exit(0);
  }

}
