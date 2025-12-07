import * as fs from 'fs';

/**
 * Parse the worksheet arranged horizontally into vertical problems.
 * Problems are separated by a full column of spaces. Within a problem,
 * the bottom non-empty line is the operator ("+" or "*") and the
 * preceding non-empty lines are the numbers (top -> bottom).
 */
export function solve(input: string): bigint {
  const rawLines = input.replace(/\r/g, '').split('\n');
  // Remove any trailing empty line
  if (rawLines.length > 0 && rawLines[rawLines.length - 1].length === 0) rawLines.pop();

  const maxLen = rawLines.reduce((m, r) => Math.max(m, r.length), 0);
  const rows = rawLines.map(r => r + ' '.repeat(maxLen - r.length));

  // Determine separator columns (columns that are all spaces)
  const sep: boolean[] = new Array(maxLen);
  for (let c = 0; c < maxLen; c++) {
    let allSpace = true;
    for (let r = 0; r < rows.length; r++) {
      if (rows[r][c] !== ' ') { allSpace = false; break; }
    }
    sep[c] = allSpace;
  }

  // Collect contiguous non-separator column segments as problems
  const segments: Array<[number, number]> = [];
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
    // Collect non-empty trimmed lines inside this segment (top to bottom)
    const entries: string[] = [];
    for (const row of rows) {
      const piece = row.slice(l, r + 1).trim();
      if (piece.length > 0) entries.push(piece);
    }
    if (entries.length === 0) continue;
    const op = entries[entries.length - 1].trim();
    const numStrs = entries.slice(0, -1);
    const nums = numStrs.map(s => BigInt(s.replace(/\s+/g, '')));
    let value = 0n;
    if (op.includes('+')) {
      value = nums.reduce((a, b) => a + b, 0n);
    } else {
      value = nums.reduce((a, b) => a * b, 1n);
    }
    grandTotal += value;
  }

  return grandTotal;
}

if (require.main === module) {
  let data: string;
  try { data = fs.readFileSync('./day06/input06.txt', 'utf8'); }
  catch (e) { data = fs.readFileSync('./input06.txt', 'utf8'); }
  console.log(solve(data).toString());
}
