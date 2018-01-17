import os from 'os';

import chalk from 'chalk';

import argv from 'helpers/argv';
import { Update } from 'modules/package-manager';

export default function update() {
  const packageName = argv.getParam(1);
  console.log(chalk.yellowBright(`updating package "${packageName}", please wait ...`, os.EOL));
  new Update(packageName);
}
