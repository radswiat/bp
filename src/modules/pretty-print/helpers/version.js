import chalk from 'chalk';

import { transcript } from 'config';

/**
 * Pretty print version
 * - color diff if any
 * @param version
 * @return {string}
 */
export default function ({ root, local }) {
  let status = transcript.PACKAGE_UP_TO_DATE;

  if (!root) {
    status = transcript.PACKAGE_NOT_IN_CORE;
    return [chalk.gray(`[${local}]`), status];
  }

  if (!local) {
    status = transcript.PACKAGE_NOT_INSTALLED;
    return [chalk.gray(`[${root}]`), status];
  }

  root = root.split('.');
  local = local.split('.');

  let colorAll = false;

  // iterate through version numbers
  // supported format: x.x.x-release
  for (let i = 0; i < 3; i++) {
    if (root[i] !== local[i] || colorAll) {
      root[i] = `${chalk.greenBright(root[i])}`;
      local[i] = `${chalk.redBright(local[i])}`;
      colorAll = true;
    } else {
      root[i] = `${chalk.gray(root[i])}`;
      local[i] = `${chalk.gray(local[i])}`;
    }
  }

  local = local.join('.');
  root = root.join('.');

  if (local === root) {
    return [chalk.gray(`[${root}]`), status];
  }

  status = transcript.PACKAGE_OUT_OF_DATE;

  // if version check is the same
  return [chalk.gray(`[${local} → ${root}]`), status];
}
