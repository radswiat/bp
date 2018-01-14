export default function(string) {
  return new Promise((resolve, reject) => {
    let parsed = null;
    try {
      parsed = JSON.parse(string);
    } catch (err) {
      reject(err);
      return;
    }
    resolve(parsed);
  });
}
