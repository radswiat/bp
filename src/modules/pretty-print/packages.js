import chalk from 'chalk';
import Table from 'cli-table';

import { transcript, others } from 'config';
import Verify from 'modules/package-manager/verify';

import printVersion from './helpers/version';

export default new class PrintPackages {

  static async getVerifyReport({ root, local }) {
    const verify = new Verify(root, local);
    return await verify.isVerified() ? transcript.PACKAGE_VERIFIED : transcript.PACKAGE_NOT_VERIFIED;
  }

  /**
   * Print version table
   * @param packages
   */
  async print(packages) {
    const table = new Table(others.tableStyle);
    for (const pack of packages) {
      const verifyReport = await PrintPackages.getVerifyReport(pack.files);
      table.push([
        chalk.cyanBright(`[${pack.name}]`),
        verifyReport,
        ...printVersion(pack.version),
        pack.description,
      ]);
    }
    console.log(table.toString());
  }
};
