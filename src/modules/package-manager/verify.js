import hashFile from 'hash-file';

import groupFiles from './utils/group-files';

/**
 * Verify package
 * - verify only works between packages with same version!
 */
export default class Verify {

  constructor(root, local) {
    this.root = root;
    this.local = local;
  }

  async isVerified() {

    let isVerified = true;

    // if root or local missing, skip verification
    if (!this.root || !this.local) return true;

    // concat files
    const files = this.root.concat(this.local);

    // group files by path
    const grouped = groupFiles(files);

    for (const key of Object.entries(grouped)) {

      const group = key[1];

      // if group has only 1 or 0 files, it means
      // that this file doesn't exists in both repos
      if (group.length <= 1) {
        isVerified = false;
        // one unverified found is enough now, break
        break;
      }

      const hash1 = await hashFile(group[0]);
      const hash2 = await hashFile(group[1]);
      if (hash1 !== hash2) {
        isVerified = false;
        // one unverified found is enough now, break
        break;
      }
    }

    return isVerified;
  }
}
