const fs = require('fs');

function solve(input) {
  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let pos = 50;
  let zeros = 0;
  for (const line of lines) {
    const dir = line[0];
    const dist = Number(line.slice(1));
    if (!Number.isFinite(dist)) continue;
    if (dir === 'R') pos = (pos + dist) % 100;
    else if (dir === 'L') pos = ((pos - dist) % 100 + 100) % 100;
    if (pos === 0) zeros++;
  }
  return zeros;
}

const inputPath = './input01.txt';
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  console.error('Create the file `input01.txt` in the repository root, then run `node day01_test.js`.');
  process.exit(1);
}

const input = fs.readFileSync(inputPath, 'utf8');
console.log(solve(input));
