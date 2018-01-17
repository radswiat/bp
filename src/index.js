import to from 'await-to-js';

import localConfig from 'modules/local-config';
import github from 'modules/github';

import { paths } from 'config';
import { mkdirp } from 'utils';
import log from 'helpers/log';
import emoji from 'node-emoji';

import router from './router';

new class App {

  constructor() {
    this.init();
  }

  async init() {

    // say hi to user :)
    log.start(`Package Manager ${emoji.get('unlock')}`);

    // create storage path
    // it has to exists before any execution!
    this.createStoragePath();

    // initialize config
    await localConfig.init();

    // initialize github
    await github.init();

    // start routing
    router.init();
  }

  async createStoragePath() {
    const [err] = await to(mkdirp(paths.internalStorage));
    if (err) {
      console.log(err);
    }
  }

};
