/* eslint "promise/prefer-await-to-callbacks": "off" */
import fs from 'fs';

export default function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf-8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(content);
    });
  });
}
