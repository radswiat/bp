import { spawn } from 'child_process';

import { paths } from 'config';

export default function(cmd, args, cwd = paths.internalStorage) {
  return new Promise((resolve, reject) => {
    const ls = spawn(cmd, [...args], {
      cwd,
    });
    ls.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    // we can't determine if error should break execution
    // or maybe its just warning to us like: "Already on 'develop'"
    // due to that, we will just ignore error and not reject
    ls.stderr.on('data', (data) => {
      // console.log(`stderr: ${data}`);
    });

    ls.on('close', () => {
      resolve();
    });
  });
}
