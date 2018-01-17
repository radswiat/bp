import path from 'path';

import { github } from 'config';

export default function findLocalBaseDir(rootBaseDir) {
  return path.resolve(path.join(process.cwd(), rootBaseDir.split(new RegExp(`(${github.folderName})`))[2]));
}
