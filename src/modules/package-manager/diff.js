import path from 'path';
import hashFile from 'hash-file';

import { readFile } from 'utils';
import { github, transcript } from 'config';

import groupFiles from './utils/group-files';

const jsdiff = require('diff');

/**
 * Diff package files
 */
export default class Diff {

  constructor(root, local) {
    this.root = root;
    this.local = local;
  }

  static isRootFile(filePath) {
    return new RegExp(`(${github.folderName})`).test(filePath);
  }

  static getFileSlug(filePath) {
    const tmp = filePath.split(path.sep);
    const slug = tmp.slice(Math.max(tmp.length - 2, 1)).join(path.sep);
    return slug;
  }

  async diff() {

    const diffResults = {};

    // if root or local missing, skip diff
    if (!this.root || !this.local) return null;

    // concat files
    const files = this.root.concat(this.local);

    // group files by path
    const grouped = groupFiles(files);

    for (const key of Object.entries(grouped)) {

      const group = key[1];

      const diffGroup = diffResults[Diff.getFileSlug(group[0])] = {};

      diffGroup.file = group[0];

      // if group has only 1 or 0 files, it means
      // that this file doesn't exists in both repos
      if (group.length <= 1) {
        if (Diff.isRootFile(group[0])) {
          diffGroup.status = transcript.DIFF_FILE_IN_ROOT_ONLY;
        } else {
          diffGroup.status = transcript.DIFF_FILE_IN_LOCAL_ONLY;
        }
        break;
      }

      // if hashes are equal, no diff in those files
      const hash1 = await hashFile(group[0]);
      const hash2 = await hashFile(group[1]);
      if (hash1 === hash2) {
        diffGroup.status = transcript.DIFF_NO_CHANGES;
        break;
      }

      const file1 = await readFile(group[0]);
      const file2 = await readFile(group[1]);
      const diff = jsdiff.diffLines(file1, file2);
      diffGroup.status = transcript.DIFF_CHANGES;
      diffGroup.diff = diff;
    }

    return diffResults;
  }
}
