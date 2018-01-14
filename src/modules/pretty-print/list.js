import chalk from 'chalk';
import Table from 'cli-table';

import { others } from 'config';


export default new class List {

  static printVersion = (version) => {

    if (Array.isArray(version)) {
      return chalk.gray(`[${chalk.redBright(version[1])} → ${chalk.greenBright(version[0])}]`);
    }

    return chalk.gray(`[${version}]`);
  };

  print(packages) {
    const table = new Table(others.tableStyle);

    for (const pack of packages) {
      const packInfo = pack.packageJson;
      table.push([
        chalk.cyanBright(`[${packInfo.name}]`),
        List.printVersion(packInfo.version),
        pack.status ? pack.status : 'up to date',
        packInfo.description,
      ]);
    }

    console.log(table.toString());
  }

}
