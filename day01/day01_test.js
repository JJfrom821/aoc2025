const fs = require('fs');

function solve(input) {
  // Method 0x434C49434B: Count all times dial points at 0 (including intermediate hits)
  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let pos = 50;
  let total = 0;
  for (const line of lines) {
    const dir = line[0];
    const dist = Number(line.slice(1));
    if (!Number.isFinite(dist) || dist <= 0) continue;
    let firstK;
    if (dir === 'R') firstK = (100 - (pos % 100)) % 100;
    else if (dir === 'L') firstK = pos % 100;
    else continue;
    if (firstK === 0) firstK = 100;
    if (firstK <= dist) total += Math.floor((dist - firstK) / 100) + 1;
    if (dir === 'R') pos = (pos + dist) % 100;
    else pos = ((pos - dist) % 100 + 100) % 100;
  }
  return total;
}

let inputPath = './input01.txt';
if (!fs.existsSync(inputPath)) {
  // fallback to day-specific path
  inputPath = './day01/input01.txt';
}
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ./input01.txt or ./day01/input01.txt`);
  process.exit(1);
}

const input = fs.readFileSync(inputPath, 'utf8');
console.log(solve(input));
