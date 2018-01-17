import chalk from 'chalk';

import argv from 'helpers/argv';
import { transcript } from 'config';
import { Packages, Diff } from 'modules/package-manager';
import { printDiff } from 'modules/pretty-print';

export default class DiffRoute {
  constructor() {
    this.packageName = argv.getParam(1);
    this.init();
  }

  async init() {
    this.packs = new Packages();
    this.packages = await this.packs.get();
    if (!this.packs.exists(this.packageName)) {
      console.log(transcript.DIFF_PACKAGE_NOT_FOUND);
    }

    const pack = this.packs.getByName(this.packageName);
    const diff = new Diff(pack.files.root, pack.files.local);
    const filesDiff = await diff.diff();
    printDiff.print(this.packageName, filesDiff);
  }

}
