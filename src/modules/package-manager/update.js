import os from 'os';

import fs from 'fs-extra';
import chalk from 'chalk';

import { transcript } from 'config';

import Packages from './packages';
import findRootBaseDir from './utils/find-root-base-directory';
import findLocalBaseDir from './utils/find-local-base-directory';

export default class Update {

  constructor(packageName) {
    this.packageName = packageName;
    this.update();
  }

  async update() {
    // get packages
    const packs = new Packages();
    await packs.get();

    // get package by name
    const pack = packs.getByName(this.packageName);

    // check if package is installed or not
    // inform user
    if (!pack.files.local) {
      console.log(transcript.UPDATE_NOT_INSTALLED, os.EOL);
    } else {
      console.log(transcript.UPDATE_INSTALLED_UPDATING, os.EOL);
    }

    // if no root files,
    // stop update, exit with errors
    if (!pack.files.root) {
      console.log(transcript.UPDATE_ROOT_FILES_NOT_FOUND, os.EOL);
      process.exit();
    }

    // find base dir for local and root package
    const rootPackageBaseDir = findRootBaseDir(pack.files.root);

    // if any local files
    // delete all files in local dir
    if (pack.files.local) {
      for (const localFile of pack.files.local) {
        try {
          fs.unlinkSync(localFile);
        } catch (err) {
          console.log(err);
          process.exit(1);
        }
      }
    }

    // find out local base dir from comparision to process.cwd() dir
    const localPackageBaseDir = findLocalBaseDir(rootPackageBaseDir);

    fs.copy(rootPackageBaseDir, localPackageBaseDir, {
      filter: (src, dist) => {
        console.log(`${chalk.gray('coping: ')} ${chalk.green(src)} ${chalk.gray('to')} ${chalk.greenBright(dist)}`);
        return true;
      } },
    (err) => {
      if (!err) {
        console.log(os.EOL, chalk.greenBright(`package version ${chalk.yellowBright(pack.version.root)}`));
        process.exit();
      }
      console.log(err);
    });

  }

}
