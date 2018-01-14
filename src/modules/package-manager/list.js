import path from 'path';

import semverDiff from 'semver-diff';
import glob from 'glob';

import { paths, github } from 'config';
import { readJson, isDefined } from 'utils';

import verify from './verify';

/**
 * Get list of packages
 * - returns:
 *    - packageJson data
 *    - list of files
 *    - package path
 */
export default class List {

  static local = process.cwd();
  static root = paths.repository;

  static rootRegExp = new RegExp(`(${github.folderName})`);

  static convertToTypedPacks = (arr) => {
    const obj = {};
    arr.map((d) => {
      if (d.root) {
        obj.root = d;
      } else {
        obj.local = d;
      }
    });
    return obj;
  };

  /**
   * Get combined list ( boilerplate + local diff )
   * @return {Promise<array>}
   */
  async get() {
    const root = await this.getRoot();
    const local = await this.getLocal();

    // concat local and root
    const joined = root.concat(local);


    // combine root and local
    // - use object notation
    // - each object contains array
    // - in array, you will have 1 or 2 objects ( local and root package )
    const combined = {};
    for (const pack of joined) {
      const packInfo = pack.packageJson;
      if (!isDefined(combined[packInfo.name])) {
        combined[packInfo.name] = [];
      }
      combined[packInfo.name].push(pack);
    }

    // diff the combine
    const diff = [];
    for (const [packName, packArr] of Object.entries(combined)) {

      // check if second pack exists,
      // if not - root or local is missing it, find out which
      if (!isDefined(packArr[1])) {
        let status = '';
        if (packArr[0].root) {
          status = 'package not installed';
        } else {
          status = 'package does not exists in boilerplate!';
        }
        // push pack to diff with status
        // no need for version checking or others
        diff.push({
          ...packArr[0],
          status,
        });
        // skip rest, continue next iteration
        continue;
      }

      // we need to know which one is root and which local
      // we want to return root as a main one to make sure
      // description and other data is always pulled from root
      // local is used only to determine version
      const { root, local } = List.convertToTypedPacks(packArr);
      const status = semverDiff(local.packageJson.version, root.packageJson.version);
      // console.log(`${packName}: ${packArr[0].packageJson.version} ? ${packArr[1].packageJson.version}`);

      // version should be an array, if there are any differences
      if (status) {
        root.packageJson.version = [root.packageJson.version, local.packageJson.version];
      }

      // verify package
      // check if all files are the same inside the package
      // only make this check if versions are equal
      let verified;
      if (!status) {
        verified = await verify.verify(root, local);
      }

      diff.push({
        ...root,
        status,
        verified,
      });
    }

    return diff;
  }

  /**
   * Get root list ( boilerplate )
   * @return {Promise<*>}
   */
  async getRoot() {
    return this._get(List.root);
  }

  /**
   * Get local list ( local project )
   * @return {Promise<*>}
   */
  async getLocal() {
    return this._get(List.local);
  }

  /**
   * Get list of packages
   * @private
   * @param basePath
   * @return {Promise<Array>}
   */
  async _get(basePath) {
    const list = [];
    for (const comp of paths.components) {
      // const boilerplatePath = path.resolve(paths.repository, comp);
      const repoPath = path.resolve(basePath, comp);
      const files = glob.sync(`${repoPath}/**/package.json`);
      for (const packageJsonPath of files) {
        list.push(await this._handlePackage(packageJsonPath));
      }
    }
    return list;
  }

  /**
   * Handle package
   * @private
   * @param packageJsonPath
   * @return {Promise<{packageJson: *, files: *, packagePath: string}>}
   */
  async _handlePackage(packageJsonPath) {
    const packagePath = packageJsonPath.split(path.sep).slice(0, -1).join(path.sep);
    const packageJson = await readJson(packageJsonPath);
    const files = glob.sync(`${packagePath}/**/*.*`);

    // lowercase package name, just in case
    packageJson.name = packageJson.name.toLowerCase();

    return {
      // package json data { name, description, version }
      packageJson,
      // package file list
      files,
      // package path
      packagePath,
      // is this a root package ?
      root: List.rootRegExp.test(packageJsonPath),
    };
  }

}
