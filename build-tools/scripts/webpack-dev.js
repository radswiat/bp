/* eslint-disable global-require */
import webpack from 'webpack';
import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Webpack debug build runner
 * - run webpack in debug mode,
 * - no dev server
 * - will give you the webpack output in /build
 */
export default new class WebpackDebug {

  // require webpack config
  webpackConfig = require('../webpack-config/webpack.dev');

  constructor() {

    // create webpack compiler
    const compiler = webpack(this.webpackConfig);

    console.log(chalk.bgYellow.black(' webpack debug starting ... '));

    compiler.watch({}, (err, stats) => {
      setTimeout(() => {
        console.log('done!');
        spawn('npm', ['i', '-g'], {
          stdio: 'inherit',
          cwd: path.resolve(process.cwd()),
        });
      });
      console.log('[webpack:build]', stats.toString({
        colors: true,
      }));
    });
  }
};

