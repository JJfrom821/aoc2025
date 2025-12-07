const fs = require('fs');

function solve(input) {
  const rawLines = input.replace(/\r/g, '').split('\n');
  if (rawLines.length > 0 && rawLines[rawLines.length - 1].length === 0) rawLines.pop();

  const maxLen = rawLines.reduce((m, r) => Math.max(m, r.length), 0);
  const rows = rawLines.map(r => r + ' '.repeat(maxLen - r.length));

  let grandTotal = 0n;
  let currentProblem = [];
  let problemOperator = '';

  // Process columns RIGHT-TO-LEFT
  for (let c = maxLen - 1; c >= 0; c--) {
    let column = '';
    for (let r = 0; r < rows.length; r++) {
      column += rows[r][c];
    }

    const isSeparator = column.trim().length === 0;

    if (isSeparator) {
      if (currentProblem.length > 0 && problemOperator) {
        const nums = currentProblem.map(val => BigInt(val));
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
      const colLines = column.split('');
      const lastLine = colLines[colLines.length - 1].trim();
      const numberParts = colLines.slice(0, -1).map(c => c.trim()).filter(Boolean);

      if (lastLine === '+' || lastLine === '*') {
        problemOperator = lastLine;
      }

      if (numberParts.length > 0) {
        const numStr = numberParts.join('');
        currentProblem.push(numStr);
      }
    }
  }

  if (currentProblem.length > 0 && problemOperator) {
    const nums = currentProblem.map(val => BigInt(val));
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

const inputPath = process.argv[2] || './day06/input06.txt';
const input = fs.readFileSync(inputPath, 'utf8');
console.log(solve(input).toString());
