import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import paths from '../config/paths';

module.exports = {
  // devtool: 'cheap-module-source-map',
  target: 'node',
  entry: [
    'babel-polyfill',
    paths.appIndexJs,
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.output,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // virtual path to file that is served by WebpackDevServer in development.
    filename: 'index.js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: '[name].chunk.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [
      '.js', '.json',
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // "url" loader works like "file" loader except that it embeds assets
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
      },
    ],
  },
  plugins: [
    // clean build folder
    // we can't clean due to src/content/api running simultaneously
    new CleanWebpackPlugin(paths.outputIndexPath, {allowExternal: true}),
    // allow webpack to build proper global node.js code
    // it will break without it
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
};

