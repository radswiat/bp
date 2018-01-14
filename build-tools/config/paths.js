import path from 'path';

export default {
  appIndexJs: path.resolve(process.cwd(), 'src/index.js'),
  output: path.resolve(process.cwd(), 'bin/'),
  appPathSrc: path.resolve(process.cwd(), 'src'),
};
