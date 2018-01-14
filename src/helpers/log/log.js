import chalk from 'chalk';
// import path from 'path';
import symbols from 'log-symbols';
// import StackParser from 'error-stack-parser';
import stripAnsi from 'strip-ansi';

/**
 * Logging class
 * todo:
 * - implement save to file
 * - implement ....
 */
class Log {

  static maxChar = 80;

  /**
   * Decorate log,
   * fill [FILL] tag with "-" characters, up to maximum line width
   * example:
   *  if maxChar is 100, and 20 is used, it will add "-" 80 times
   * @param string
   */
  static fill(string) {
    let fillString = '';
    // strip ansii before calculating length, as it will disturb output
    const fillChars = stripAnsi(string.trim().split(/\[FILL]/).join('')).length;
    for (let i = Log.maxChar - fillChars; i; i-- ) {
      fillString += '-';
    }
    return string.replace(/\[FILL]/, chalk.black.bold(fillString)).trim();
  }

  static clear() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
    process.stdout.write('\u001b[2J\u001b[0;0H');
    process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
    console.log('\x1Bc');
    process.stdout.write('\x1Bc');
  }

  /**
   * Log info
   * prints in format like:
   *  [Title] --------- [Value]
   * @param title
   * @param value
   */
  info(title, value) {
    console.log(Log.fill(`
      [${chalk.cyan(title)}] [FILL] ${value ? `[${chalk.cyan(value)}]` : ''}
    `));
  }

  /**
   * Log status
   * prints in format like:
   *  [Type] --------- [OK]
   * @param title
   * @param status
   */
  status(title, status) {
    const statusString = status === false ? symbols.error : symbols.success;
    console.log(Log.fill(`
      [${chalk.yellow(title)}] [FILL] [${statusString}]
    `));
  }

  customError(title, error) {
    console.log(
      `[${symbols.error}]:`,
      `[${chalk.red(title)}]`,
      `${chalk.red(`
${Log.fill('- [FILL] -')}
${error}  
${Log.fill('- [FILL] -')}
       `)}`,
    );
  }

  /**
   * Log errors
   * Prints in format like:
   *  [ERR] [ERR TYPE]
   *  [STACK]
   * @param err
   */
  error(err) {
    console.log(
      `[${symbols.error}]:`,
      `[${chalk.red('ERR')}]`,
      `[${chalk.red(err.code)}]`,
    );
    console.log(
      `[${symbols.error}]:`,
      `${chalk.red(err.message)}`,
    );
  }

  /**
   * Start script log
   * @param title
   * @param description
   * @param noClear
   */
  start(title, description, noClear) {
    if (!noClear) Log.clear();
    console.log(chalk.yellow(Log.fill('- [FILL] -')));
    console.log(`Executing: ${chalk.yellow(title)}`);
    if (description && description.length) {
      console.log(description);
    }
    console.log(chalk.yellow(Log.fill('- [FILL] -')));
  }

  /**
   * Script section log
   * @param title
   * @param description
   */
  section(title, description) {
    console.log(`Section: ${chalk.gray(title)}`);
    if (description && description.length) {
      console.log(description);
    }
    console.log(chalk.gray(Log.fill('- [FILL] -')));
  }

  separator() {
    console.log();
  }

  success(message) {
    console.log(
      `[${symbols.success}]:`,
      `[${chalk.green('success')}]`,
      `${chalk.green(`
      
  ${Log.fill('- [FILL] -')}
  ${message}  
  ${Log.fill('- [FILL] -')}
        
       `)}`,
    );
  }
}

export default new Log();
