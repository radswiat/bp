import fs from 'fs';

export default function (path) {
  return fs.existsSync(path);
}
