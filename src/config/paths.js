import path from 'path';

import system from './system';
import github from './github';

const userDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const rootStorageDir = `/${userDir}/.${system.packageShort}/`;

export default {
  // path to internal storage of the package manager
  // place where we store all app data
  internalStorage: path.resolve(rootStorageDir, 'storage'),
  // path to repository inside internal storage
  // boilerplate repo path
  repository: path.resolve(rootStorageDir, 'storage', github.folderName),
  // paths to core components that's gonna be synced
  components: [
    'src/app/core/components/containers',
    'src/app/core/components/hoc',
    'src/app/core/components/modules',
    'src/app/core/components/singletons',
    'src/app/core/components/system',
    'src/app/core/components/ui',
  ],
};
