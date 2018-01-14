import path from 'path';

import to from 'await-to-js';

import log from 'helpers/log';
import { writeFile, readJson, parseJson } from 'utils';
import { paths } from 'config';

/**
 * Config
 * loading, saving, validating
 * @class
 */
export default new class Config {

  // path and filename of the config file
  static configPath = path.resolve(paths.internalStorage, 'config.json');

  /**
   * Init
   */
  async init() {
    this.config = await this._getConfig();
  }

  get(key) {
    return this.config[key];
  }

  /**
   * Get config
   * @exit if config not found
   * @return {Promise<void>}
   * @private
   */
  async _getConfig() {
    const [err, content] = await to(readJson(Config.configPath));
    if (err) {
      log.customError('config error', 'config doesn\'t exists, please make sure to set config first');
      process.exit(1);
    }
    return content;
  }

  /**
   * Set config
   * @param configString
   * @return {Promise<void>}
   */
  async setConfig(configString) {
    // validate json by trying to parse it
    const [parseError] = await to(parseJson(configString));
    if (parseError) {
      log.error(parseError);
      return;
    }
    // write new config file
    const [err] = await to(writeFile(Config.configPath, configString));
    if (err) {
      log.error(err);
      return;
    }
    log.status('config update');
  }
};
