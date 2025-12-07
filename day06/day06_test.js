const fs = require('fs');

function solve(input) {
  const rawLines = input.replace(/\r/g, '').split('\n');
  if (rawLines.length > 0 && rawLines[rawLines.length - 1].length === 0) rawLines.pop();
  const maxLen = rawLines.reduce((m, r) => Math.max(m, r.length), 0);
  const rows = rawLines.map(r => r + ' '.repeat(maxLen - r.length));

  const sep = new Array(maxLen);
  for (let c = 0; c < maxLen; c++) {
    let allSpace = true;
    for (let rr = 0; rr < rows.length; rr++) {
      if (rows[rr][c] !== ' ') { allSpace = false; break; }
    }
    sep[c] = allSpace;
  }

  const segments = [];
  let i = 0;
  while (i < maxLen) {
    while (i < maxLen && sep[i]) i++;
    if (i >= maxLen) break;
    const start = i;
    while (i < maxLen && !sep[i]) i++;
    const end = i - 1;
    segments.push([start, end]);
  }

  let grandTotal = 0n;
  for (const [l, r] of segments) {
    const entries = [];
    for (const row of rows) {
      const piece = row.slice(l, r + 1).trim();
      if (piece.length > 0) entries.push(piece);
    }
    if (entries.length === 0) continue;
    const op = entries[entries.length - 1].trim();
    const numStrs = entries.slice(0, -1);
    const nums = numStrs.map(s => BigInt(s.replace(/\s+/g, '')));
    let value = 0n;
    if (op.includes('+')) value = nums.reduce((a, b) => a + b, 0n);
    else value = nums.reduce((a, b) => a * b, 1n);
    grandTotal += value;
  }

  return grandTotal;
}

const inputPath = process.argv[2] || './day06/input06.txt';
const input = fs.readFileSync(inputPath, 'utf8');
console.log(solve(input).toString());
