import chalk from 'chalk';
import Table from 'cli-table';

import { transcript, others } from 'config';
import { isDefined } from 'utils';
import Verify from 'modules/package-manager/verify';

import printVersion from './helpers/version';

export default new class PrintPackages {

  static async getVerifyReport({ root, local }) {
    const verify = new Verify(root, local);
    return await verify.isVerified() ? transcript.PACKAGE_VERIFIED : transcript.PACKAGE_NOT_VERIFIED;
  }

  static groupByGroupName(packages) {
    const grouped = {};
    packages.map((pack) => {
      if (!isDefined(grouped[pack.group])) {
        grouped[pack.group] = [];
      }
      grouped[pack.group].push(pack);
    });
    return Object.entries(grouped);
  }

  /**
   * Print version table
   * @param packages
   */
  async print(packages) {
    const table = new Table(others.tableStyle);
    for (const [groupName, packs] of PrintPackages.groupByGroupName(packages)) {
      await this._printGroup(table, groupName, packs);
    }
    console.log(table.toString());
  }

  async _printGroup(table, groupName, packages) {
    table.push(['']);
    table.push([chalk.yellowBright(groupName)]);
    for (const pack of packages) {
      const verifyReport = await PrintPackages.getVerifyReport(pack.files);
      table.push([
        chalk.cyanBright(`[${pack.name}]`),
        verifyReport,
        ...printVersion(pack.version),
        pack.description,
      ]);
    }
  }
};
