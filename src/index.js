import fs from 'fs';
import path from 'path';

import to from 'await-to-js';

import localConfig from 'modules/local-config';
import github from 'modules/github';
import { List } from 'modules/package-manager';
import { printList } from 'modules/pretty-print';
import argv from 'helpers/argv';

import { paths } from 'config';
import { mkdirp } from 'utils';
import log from 'helpers/log';
import emoji from 'node-emoji';

new class App {

  constructor() {
    this.init();
  }

  async init() {

    // create storage path
    // it has to exists before any execution!
    this.createStoragePath();

    log.start(`Package Manager ${emoji.get('unlock')}`);

    // action: SET
    if (argv.getAction() === 'set') {
      if (argv.argv[1] === 'config') {
        await localConfig.setConfig(argv.argv[2]);
        process.exit(0);
      }
    }

    // initialize config
    await localConfig.init();

    await github.init();

    const list = new List();
    // console.log('local:');
    // const localPackages = await list.getLocal();
    // printList.print(localPackages);
    // console.log('root:');
    // const rootPackages = await list.getRoot();
    // printList.print(rootPackages);
    // console.log('joined');
    const joinedPackages = await list.get();
    printList.print(joinedPackages);
  }

  async createStoragePath() {
    const [err] = await to(mkdirp(paths.internalStorage));
    if (err) {
      console.log(err);
    }
  }

};
