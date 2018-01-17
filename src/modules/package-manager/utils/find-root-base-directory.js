import path from 'path';

/**
 * Find root recursively
 * @param files
 * @param prevDir
 * @return {*}
 */
function findBaseRecursively(files, prevDir = '') {
  let dirName = null;
  let hasDirChanged = false;
  for (const file of files) {
    const currentDirName = file.shift();
    if (!dirName) dirName = currentDirName;
    if (dirName !== currentDirName) {
      hasDirChanged = true;
    }
  }

  if (!hasDirChanged) {
    return findBaseRecursively(files, path.join(prevDir, dirName));
  }

  return prevDir;
}

/**
 * Find root directory
 * @param files
 * @return {*}
 */
export default function findRootBaseDirectory(files) {

  if (!files.length) return null;

  files = files.map((filePath) => {
    return filePath.split(path.sep);
  });

  // to find root directory, iterate every directory of all files
  // find when directory is not common far all the files,
  // and you have found your root
  let baseDir = findBaseRecursively(files);

  // fix base dir for iOS
  if (!/^\//.test(baseDir)) {
    baseDir = `/${baseDir}`;
  }

  return baseDir;
}
