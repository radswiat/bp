import chalk from 'chalk';
import Table from 'cli-table';

import { others } from 'config';

export default class HelpRoute {

  static parseHelpLine([action, description, example]) {
    return [
      chalk.yellowBright(action),
      chalk.gray(description),
      chalk.gray(example),
    ];
  }

  constructor() {
    this.printHelp();
  }

  printHelp() {
    const table = new Table(others.tableStyle);
    table.push(['action', 'description', 'example']);
    table.push(HelpRoute.parseHelpLine([
      'set config',
      'set bpm config',
      'bpm set config \'{"repository": "https://github.com/organization/repoName"}\''
    ]));
    table.push(HelpRoute.parseHelpLine([
      'update [package]',
      'update package from boilerplate',
      'bpm update cta-group',
    ]));
    table.push(HelpRoute.parseHelpLine([
      'diff [package]',
      'show difference between local and root package files',
      'bpm diff cta-group',
    ]));
    table.push(HelpRoute.parseHelpLine([
      'help',
      'show help',
      'bpm help',
    ]));
    console.log(table.toString());
  }

}
