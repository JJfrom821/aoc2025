import * as fs from 'fs';

/**
 * Parse the worksheet arranged horizontally into vertical columns.
 * Read columns RIGHT-TO-LEFT, each column forms one number.
 * The bottom element of each column is the operator.
 * Columns with only spaces are separators between problems.
 */
export function solve(input: string): bigint {
  const rawLines = input.replace(/\r/g, '').split('\n');
  if (rawLines.length > 0 && rawLines[rawLines.length - 1].length === 0) rawLines.pop();

  const maxLen = rawLines.reduce((m, r) => Math.max(m, r.length), 0);
  const rows = rawLines.map(r => r + ' '.repeat(maxLen - r.length));

  let grandTotal = 0n;
  let currentProblem: Array<[string, string]> = []; // [value, type] pairs
  let problemOperator = '';

  // Process columns RIGHT-TO-LEFT
  for (let c = maxLen - 1; c >= 0; c--) {
    // Extract column
    let column = '';
    for (let r = 0; r < rows.length; r++) {
      column += rows[r][c];
    }

    // Check if column is all spaces (separator)
    const isSeparator = column.trim().length === 0;

    if (isSeparator) {
      // End current problem if it exists
      if (currentProblem.length > 0 && problemOperator) {
        // Process the accumulated problem
        const nums = currentProblem.map(([val]) => BigInt(val));
        let value = 0n;
        if (problemOperator === '+') {
          value = nums.reduce((a, b) => a + b, 0n);
        } else {
          value = nums.reduce((a, b) => a * b, 1n);
        }
        grandTotal += value;
        currentProblem = [];
        problemOperator = '';
      }
    } else {
      // Parse column (top-to-bottom): last element is operator, rest are number parts
      const colLines = column.split('');
      const lastLine = colLines[colLines.length - 1].trim();
      const numberParts = colLines.slice(0, -1).map(c => c.trim()).filter(Boolean);

      if (lastLine === '+' || lastLine === '*') {
        problemOperator = lastLine;
      }

      if (numberParts.length > 0) {
        // Join digit by digit from top to bottom
        const numStr = numberParts.join('');
        currentProblem.push([numStr, 'number']);
      }
    }
  }

  // Process final problem if exists
  if (currentProblem.length > 0 && problemOperator) {
    const nums = currentProblem.map(([val]) => BigInt(val));
    let value = 0n;
    if (problemOperator === '+') {
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
