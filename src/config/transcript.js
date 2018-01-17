import symbol from 'log-symbols';
import chalk from 'chalk';

export default {
  PACKAGE_UP_TO_DATE: 'up to date',
  PACKAGE_OUT_OF_DATE: 'out of date',
  PACKAGE_NOT_INSTALLED: 'not installed',
  PACKAGE_NOT_IN_CORE: 'missing in core!',
  PACKAGE_VERIFIED: symbol.success,
  PACKAGE_NOT_VERIFIED: symbol.error,
  DIFF_PACKAGE_NOT_FOUND: 'package not found',
  DIFF_FILE_IN_ROOT_ONLY: 'local file missing',
  DIFF_FILE_IN_LOCAL_ONLY: 'root file missing',
  DIFF_NO_CHANGES: 'files are the same',
  DIFF_CHANGES: 'files are different',
  UPDATE_NOT_INSTALLED: chalk.gray('package not installed, installing...'),
  UPDATE_ROOT_FILES_NOT_FOUND: chalk.redBright('root package not found, nothing to install'),
  UPDATE_INSTALLED_UPDATING: chalk.gray('package installed, updating...'),
};
