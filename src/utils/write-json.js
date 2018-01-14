/* eslint "promise/prefer-await-to-callbacks": "off" */
import fs from 'fs';

export default function writeJson(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(content), 'utf-8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(content);
    });
  });
}
