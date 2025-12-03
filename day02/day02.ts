import * as fs from 'fs';

/**
 * Checks if a number is an invalid ID.
 * An invalid ID is a number where the string representation
 * is exactly a pattern repeated twice (e.g., 55, 6464, 123123).
 */
function isInvalidID(num: number): boolean {
  const str = num.toString();
  const len = str.length;

  // Must be even length and at least 2 characters
  if (len < 2 || len % 2 !== 0) return false;

  // Check if first half equals second half
  const half = len / 2;
  return str.substring(0, half) === str.substring(half);
}

/**
 * Finds all invalid IDs in a range and returns their sum.
 */
function sumInvalidIDsInRange(start: number, end: number): bigint {
  let sum = 0n;
  for (let id = start; id <= end; id++) {
    if (isInvalidID(id)) {
      sum += BigInt(id);
    }
  }
  return sum;
}

/**
 * Processes input containing comma-separated ranges (e.g., "11-22,95-115,...")
 * and returns the total sum of all invalid IDs across all ranges.
 */
function solve(input: string): bigint {
  const line = input.trim();
  const ranges = line.split(',').map(r => r.trim());
  let totalSum = 0n;

  for (const range of ranges) {
    const [startStr, endStr] = range.split('-');
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    if (isNaN(start) || isNaN(end)) {
      console.error(`Skipping malformed range: ${range}`);
      continue;
    }

    const rangeSum = sumInvalidIDsInRange(start, end);
    totalSum += rangeSum;
  }

  return totalSum;
}

function main(): void {
  const inputPath = process.argv[2] || './input02.txt';
  let input: string;

  try {
    input = fs.readFileSync(inputPath, 'utf8');
  } catch (e) {
    console.error(
      `Failed to read ${inputPath}:`,
      e instanceof Error ? e.message : e
    );
    process.exit(1);
  }

  const result = solve(input);
  console.log(result.toString());
}

if (require.main === module) main();

export { isInvalidID, sumInvalidIDsInRange, solve };
