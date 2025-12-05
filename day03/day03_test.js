const fs = require('fs');
const path = require('path');

// Node can't import TS directly without ts-node here, so implement the same logic
// in JS runner to avoid import issues.

function maxJoltageFromBankJS(line) {
  const s = line.trim();
  if (s.length < 2) return 0;
  const n = s.length;
  const digits = new Array(n);
  for (let i = 0; i < n; i++) digits[i] = s.charCodeAt(i) - 48;
  const suffixMax = new Array(n);
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

function solveJS(input) {
  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let total = 0;
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
console.log(result);
