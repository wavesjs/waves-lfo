import fs from 'fs';

export function loadPiPoOutput(filename) {
  const file = fs.readFileSync(filename).toString();
  const lines = file.replace(/\n$/, '').split('\n');
  const results = lines.map((line) => {
    const values = line.split(' ');
    return values.map((val) => (val + 0));
  });

  return results;
}
