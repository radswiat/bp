import path from 'path';
import hashFile from 'hash-file';

import groupBy from 'lodash/groupBy';

import { readFile } from 'utils';

/**
 * Verify package
 * - verify only works between packages with same version!
 */
export default new class Verify {

  async verify(root, local) {

    let packageVerified = true;

    const files = root.files.concat(local.files);

    // group files by file name
    // - to make sure, it will include 2 prev folders
    const grouped = groupBy(files, (filePath) => {
      const splitPath = filePath.split(path.sep);
      return `${splitPath[splitPath.length - 3]}/${splitPath[splitPath.length - 2]}/${splitPath[splitPath.length - 1]}`;
    });

    for (const group of Object.entries(grouped)) {

      const groupFiles = group[1];

      // if group has only 1 or 0 files, it means
      // that this file doesn't exists in both repos
      if (groupFiles.length <= 1) {
        packageVerified = false;
        // one unverified found is enough now, break
        break;
      }

      const hash1 = await hashFile(groupFiles[0]);
      const hash2 = await hashFile(groupFiles[1]);
      if (hash1 !== hash2) {
        packageVerified = false;
        // one unverified found is enough now, break
        break;
      }
    }

    return packageVerified;
  }

};
