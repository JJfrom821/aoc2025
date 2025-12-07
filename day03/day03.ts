import * as fs from 'fs';

/**
 * Select exactly 12 digits from a bank to form the largest possible number.
 * Greedy: for each digit position in the result, choose the largest digit
 * from the remaining available positions that still leaves enough digits after it.
 */
export function maxJoltageFromBank(line: string): bigint {
  const s = line.trim();
  const n = s.length;
  const needToSelect = 12;

  // Must have at least 12 digits
  if (n < needToSelect) return 0n;

  const digits = s.split('').map(c => parseInt(c, 10));
  const selected: number[] = [];
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

export function solve(input: string): bigint {
  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let total = 0n;
  for (const line of lines) {
    total += maxJoltageFromBank(line);
  }
  return total;
}

// Run as a script in both CommonJS and ESM environments
async function runIfMain() {
  let isMain = false;
  try {
    // CommonJS check
    if (typeof require !== 'undefined' && (require as any).main === module) isMain = true;
  } catch {}
  try {
    // ESM check: compare import.meta.url to executed script
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) isMain = true;
  } catch {}

  if (!isMain) return;

  const arg = process.argv[2] || './input03.txt';
  let input: string;
  try {
    input = fs.readFileSync(arg, 'utf8');
  } catch (e) {
    console.error('Failed to read input:', e instanceof Error ? e.message : e);
    process.exit(1);
  }
  console.log(solve(input).toString());
}

runIfMain();
