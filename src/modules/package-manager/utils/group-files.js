import path from 'path';

import groupBy from 'lodash/groupBy';

export default function groupFiles(files) {
  // group files by file name
  // - to make sure, it will include 2 prev folders
  return groupBy(files, (filePath) => {
    const splitPath = filePath.split(path.sep);
    return `${splitPath[splitPath.length - 3]}/${splitPath[splitPath.length - 2]}/${splitPath[splitPath.length - 1]}`;
  });
}
