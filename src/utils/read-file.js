/* eslint "promise/prefer-await-to-callbacks": "off" */
import fs from 'fs';

export default function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, content) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(content);
    });
  });
}
