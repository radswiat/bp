module.exports = require('babel-jest').createTransformer({
  // disable babelrc file
  babelrc: false,
  // cache directory
  cacheDirectory: true,
  // presets
  'presets': ['env', 'stage-2'],
    'plugins': [
    'jest-hoist',
    'transform-export-extensions',
    ['module-resolver', {
      'root': ['./src/app'],
      'alias': {
        'config': './src/config',
        'utils': './src/utils',
        'modules': './src/modules',
        'core': './src/core',
        'helpers': './src/helpers',
      },
    }],
  ],
});

