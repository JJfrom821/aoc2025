const fs = require('fs');
const path = require('path');

// Node can't import TS directly without ts-node here, so implement the same logic
// in JS runner to avoid import issues.

/**
 * Select exactly 12 digits from a bank to form the largest possible number.
 * Greedy: for each digit position in the result, choose the largest digit
 * from the remaining available positions that still leaves enough digits after it.
 */
function maxJoltageFromBankJS(line) {
  const s = line.trim();
  const n = s.length;
  const needToSelect = 12;

  // Must have at least 12 digits
  if (n < needToSelect) return 0n;

  const digits = s.split('').map(c => parseInt(c, 10));
  const selected = [];
  let pos = 0;

  for (let i = 0; i < needToSelect; i++) {
    // How many more digits do we need to select (including this one)?
    const stillNeed = needToSelect - i;
    // Range of positions from current to last valid position
    // We need at least 'stillNeed' positions remaining (including current)
    const maxPos = n - stillNeed;

    // Find the largest digit in range [pos, maxPos]
    let maxDigit = -1;
    let maxIdx = pos;
    for (let j = pos; j <= maxPos; j++) {
      if (digits[j] > maxDigit) {
        maxDigit = digits[j];
        maxIdx = j;
      }
    }

    selected.push(maxDigit);
    pos = maxIdx + 1; // Move past the selected digit for next iteration
  }

  // Convert selected digits to a bigint
  const result = selected.reduce((acc, digit) => acc * 10n + BigInt(digit), 0n);
  return result;
}

function solveJS(input) {
  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let total = 0n;
  for (const line of lines) total += maxJoltageFromBankJS(line);
  return total;
}

const inputPath = path.join(__dirname, 'input03.txt');
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}
const input = fs.readFileSync(inputPath, 'utf8');
const result = solveJS(input);
console.log(result.toString());
