import path from 'path';

import glob from 'glob';

import { paths, github } from 'config';
import { readJson, isDefined } from 'utils';

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

  /**
   * Get list
   * Returns unified and combined list of packages
   * @return {Promise<object>}
   */
  async get() {
    const rawList = await this.getRaw();
    const combinedList = await this._combine(rawList);
    this.unified = await this._unify(combinedList);
    return this.unified;
  }

  /**
   * Get list as array
   * Returns unified and combined list of packages
   * @return {Promise<array>}
   */
  async getAsArray() {
    await this.get();
    this.unifiedArray = Object.keys(this.unified).map((key) => this.unified[key]);
    return this.unifiedArray;
  }

  /**
   * Get raw list
   * Returns object combined of root and local packages array
   * @example { [ roots ], [ locals ] }
   * @return {Promise<{root: *, local: *}>}
   */
  async getRaw() {
    const root = await this._getRootPackages();
    const local = await this._getLocalPackages();
    return {
      root,
      local,
    };
  }

  /**
   * Check if package exists
   * @param packName
   * @return {boolean}
   */
  exists(packName) {
    return !!this.unified[packName];
  }

  /**
   * Get package by name
   * @param packName
   * @return {*}
   */
  getByName(packName) {
    return this.unified[packName];
  }

  /**
   * Combine raw list
   * @param list
   * @param list.root
   * @param list.local
   * @return {Promise<{object}>}
   */
  async _combine({ root, local }) {

    // concat local and root
    const joined = root.concat(local);

    // combine root and local
    // - use object notation
    // - each object contains array
    // - in array, you will have 1 or 2 objects ( local and root package )
    const combined = {};
    for (const pack of joined) {
      if (!isDefined(combined[pack.name])) {
        combined[pack.name] = { root: {}, local: {} };
      }
      if (pack.root) {
        combined[pack.name].root = pack;
      } else {
        combined[pack.name].local = pack;
      }
    }
    return combined;
  }

  /**
   * Unify combined list
   * @param list
   * @return {Promise<void>}
   */
  async _unify(list) {
    Object.keys(list).map((key) => {
      const pack = list[key];
      list[key] = {
        name: pack.root.name || pack.local.name,
        version: { root: pack.root.version, local: pack.local.version },
        description: pack.root.description || pack.local.description,
        group: pack.root.group,
        files: {
          root: pack.root.files || null,
          local: pack.local.files || null,
        },
      };
    });
    return list;
  }

  /**
   * Get root list ( boilerplate )
   * @return {Promise<*>}
   */
  async _getRootPackages() {
    return this._get(List.root);
  }

  /**
   * Get local list ( local project )
   * @return {Promise<*>}
   */
  async _getLocalPackages() {
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
    for (const [groupName, groupComponentsList] of Object.entries(paths.components)) {
      for (const comp of groupComponentsList) {
        const repoPath = path.resolve(basePath, comp);
        const files = glob.sync(`${repoPath}/**/package.json`);
        for (const packageJsonPath of files) {
          const parsedPackageJson = await this._handlePackage(packageJsonPath);
          if (parsedPackageJson) {
            parsedPackageJson.group = groupName;
            list.push(parsedPackageJson);
          }
        }
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

    // if property main exists, skip as this is probably real package.json!!
    if (isDefined(packageJson.main)) {
      return null;
    }

    const files = glob.sync(`${packagePath}/**/*.*`);

    // lowercase package name, just in case
    packageJson.name = packageJson.name.toLowerCase();

    return {
      // package json data { name, description, version }
      ...packageJson,
      // package file list
      files,
      // package path
      packagePath,
      // is this a root package ?
      root: List.rootRegExp.test(packageJsonPath),
    };
  }

}
