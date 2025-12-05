import * as fs from 'fs';

export function maxJoltageFromBank(line: string): number {
  const s = line.trim();
  if (s.length < 2) return 0;
  const n = s.length;
  const digits: number[] = new Array(n);
  for (let i = 0; i < n; i++) digits[i] = s.charCodeAt(i) - 48; // '0' -> 48

  const suffixMax: number[] = new Array(n);
  suffixMax[n - 1] = digits[n - 1];
  for (let i = n - 2; i >= 0; i--) suffixMax[i] = Math.max(digits[i], suffixMax[i + 1]);

  let best = 0;
  for (let i = 0; i < n - 1; i++) {
    const tens = digits[i];
    const bestOnes = suffixMax[i + 1];
    const candidate = tens * 10 + bestOnes;
    if (candidate > best) best = candidate;
  }
  return best;
}

export function solve(input: string): number {
  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let total = 0;
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
  console.log(solve(input));
}

runIfMain();
