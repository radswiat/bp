import GitHubApi from 'github';
import to from 'await-to-js';

import log from 'helpers/log';
import spawn from 'helpers/spawn';
import localConfig from 'modules/local-config';
import { paths, github } from 'config';
import { directoryExists } from 'utils';

export default new class Github {

  static repoRootPath = paths.internalStorage;
  static repoPath = paths.repository;

  async init() {
    if (!this.isCloned()) {
      await this.clone();
    }
    await this.checkout(github.masterBranch);
    await this.pull(github.masterBranch);
  }

  isCloned() {
    console.log(Github.repoPath);
    return directoryExists(Github.repoPath);
  }

  /**
   * Checkout git branch
   * @param branch
   * @return {*}
   */
  checkout(branch) {
    return spawn('git', ['checkout', branch], Github.repoPath);
  }

  /**
   * Pull git branch
   * @return {*}
   */
  pull(branch) {
    return spawn('git', ['pull', 'origin', branch], Github.repoPath);
  }

  /**
   * Clone repository
   */
  clone() {
    console.log(github.folderName);
    console.log(localConfig);
    return spawn('git', ['clone', localConfig.config.repository, github.folderName], Github.repoRootPath);
  }

};
