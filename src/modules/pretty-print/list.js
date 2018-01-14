import chalk from 'chalk';
import Table from 'cli-table';
import symbol from 'log-symbols';

import { others } from 'config';
import { isDefined } from 'utils';

export default new class List {

  /**
   * Pretty print version
   * - color diff if any
   * @param version
   * @return {string}
   */
  static printVersion = (version) => {
    if (Array.isArray(version)) {
      const vRoot = version[0].split('.');
      const vLocal = version[1].split('.');
      let colorAll = false;
      for (const i in vRoot) {
        if (vRoot[i] !== vLocal[i] || colorAll) {
          vRoot[i] = `${chalk.greenBright(vRoot[i])}`;
          vLocal[i] = `${chalk.redBright(vLocal[i])}`;
          colorAll = true;
        } else {
          vRoot[i] = `${chalk.gray(vRoot[i])}`;
          vLocal[i] = `${chalk.gray(vLocal[i])}`;
        }
      }
      return chalk.gray(`[${vLocal.join('.')} → ${vRoot.join('.')}]`);
    }
    return chalk.gray(`[${version}]`);
  };

  /**
   * Print version table
   * @param packages
   */
  print(packages) {
    const table = new Table(others.tableStyle);
    for (const pack of packages) {
      const packInfo = pack.packageJson;
      table.push([
        chalk.cyanBright(`[${packInfo.name}]`),
        isDefined(pack.verified) ? pack.verified ? symbol.success : symbol.error : '',
        List.printVersion(packInfo.version),
        pack.status ? pack.status : 'up to date',
        packInfo.description,
      ]);
    }
    console.log(table.toString());
  }
}
