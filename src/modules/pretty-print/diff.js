import os from 'os';

import chalk from 'chalk';
import Table from 'cli-table';

import { others } from 'config';

export default new class PrintDiff {

  static equalStringWidth(string) {
    const min = 4;
    const length = String(string).length;
    for (let i = min - length; i; i--) {
      string += ' ';
    }
    return string;
  }

  static fillString(count) {
    let string = '';
    for (let i = count; i; i--) {
      string += ' ';
    }
    return string;
  }

  static printLine({ count, line, added, removed }, lineIndex) {
    let isDiff = true;
    let lineColor = '';
    let fillColor = '';
    if (added) {
      lineColor = 'greenBright';
      fillColor = 'bgGreenBright';
    } else if (removed) {
      lineColor = 'redBright';
      fillColor = 'bgRedBright';
    } else {
      isDiff = false;
      lineColor = 'gray';
    }


    if (isDiff && (/^([ ]+)$/.test(line) || line === '')) {
      line = PrintDiff.fillString(1);
      console.log(`${chalk.gray(PrintDiff.equalStringWidth(lineIndex))}${chalk[fillColor](line)}`);
      return;
    }

    console.log(`${chalk.gray(PrintDiff.equalStringWidth(lineIndex))}${chalk[lineColor](line)}`);
  }

  /**
   * Print version table
   * @param packages
   */
  async print(packageName, diffs) {
    const table = new Table(others.tableStyle);
    Object.keys(diffs).map((slug) => {
      const diff = diffs[slug];
      let diffCount = 0;
      let lineIndex = 0;
      if (diff.diff) {
        console.log(`${os.EOL}${os.EOL}${os.EOL}${chalk.gray(slug)}${os.EOL}`);
        diff.diff.map(({ count, value, added, removed }) => {
          value = value.split(os.EOL);
          value.map((line) => {
            if (added || removed) diffCount++;
            PrintDiff.printLine({ count, line, added, removed }, lineIndex);
            lineIndex++;
          });
        });
      }

      table.push([
        `${slug}`,
        diff.status,
        `diff count: ${diffCount}`,
      ]);
    });

    console.log('');
    console.log(chalk.yellowBright(`diff summary of ${packageName}`));
    console.log(table.toString());
  }
};
