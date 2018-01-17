import chalk from 'chalk';
import { Packages } from 'modules/package-manager';
import { printPackages } from 'modules/pretty-print';

export default class Default {
  constructor() {
    console.log(chalk.yellowBright('command: default'));
    this.print();
  }

  async print() {
    const packs = new Packages();
    const packagesList = await packs.getAsArray();
    printPackages.print(packagesList);
  }
}
