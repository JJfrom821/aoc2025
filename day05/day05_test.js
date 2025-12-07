const fs = require('fs');

function parseRange(line) {
  const [a, b] = line.split('-').map(s => parseInt(s, 10));
  return [a, b];
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  ranges.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const out = [];
  let [curL, curR] = ranges[0];
  for (let i = 1; i < ranges.length; i++) {
    const [l, r] = ranges[i];
    if (l <= curR + 1) curR = Math.max(curR, r);
    else { out.push([curL, curR]); curL = l; curR = r; }
  }
  out.push([curL, curR]);
  return out;
}

function countFresh(ranges) {
  const merged = mergeRanges(ranges);
  let count = 0;
  for (const [l, r] of merged) {
    count += r - l + 1;
  }
  return count;
}

function solve(input) {
  const parts = input.split(/\r?\n\s*\r?\n/);
  const rangesPart = parts[0] || '';

  const ranges = rangesPart.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(parseRange);
  return countFresh(ranges);
}

const inputPath = process.argv[2] || './day05/input05.txt';
const input = fs.readFileSync(inputPath, 'utf8');
console.log(solve(input));
