import * as fs from 'fs';

interface Machine {
  joltage: number[];
  buttons: number[][];
}

function parseInput(input: string): Machine[] {
  const lines = input.replace(/\r/g, '').split('\n').filter(l => l.length > 0);
  const machines: Machine[] = [];

  for (const line of lines) {
    // Parse joltage requirements: {3,5,4,7}
    const joltageMatch = line.match(/\{([0-9,]+)\}/);
    const joltageStr = joltageMatch![1];
    const joltage = joltageStr.split(',').map(s => parseInt(s, 10));

    // Parse buttons: (3) (1,3) (2) etc
    const buttonMatches = line.match(/\(([0-9,]*)\)/g)!;
    const buttons: number[][] = [];

    for (const match of buttonMatches) {
      const indices = match.slice(1, -1); // Remove parens
      if (indices.length === 0) {
        buttons.push([]);
      } else {
        buttons.push(indices.split(',').map(s => parseInt(s, 10)));
      }
    }

    machines.push({ joltage, buttons });
  }

  return machines;
}

/**
 * Solve joltage counter problem using intelligent backtracking with early termination
 * Returns the minimum number of button presses, or -1 if impossible
 */
function solveMachine(machine: Machine): number {
  const m = machine.joltage.length; // number of counters
  const n = machine.buttons.length; // number of buttons

  // Build coefficient matrix
  const coeff: number[][] = [];
  for (let counter = 0; counter < m; counter++) {
    const row = new Array(n).fill(0);
    for (let btn = 0; btn < n; btn++) {
      const count = machine.buttons[btn].filter(c => c === counter).length;
      row[btn] = count;
    }
    coeff.push(row);
  }

  // Check if solvable - impossible if any counter can't be influenced but has a target
  for (let counter = 0; counter < m; counter++) {
    if (coeff[counter].every(v => v === 0) && machine.joltage[counter] !== 0) {
      return -1;
    }
  }

  let best_total = Infinity;

  // Use branch and bound with dynamic limits
  function backtrack(btn_idx: number, presses: number[], current_sum: number): void {
    // Pruning
    if (current_sum >= best_total) return;

    if (btn_idx === n) {
      // Check if solution is valid
      for (let counter = 0; counter < m; counter++) {
        let sum = 0;
        for (let b = 0; b < n; b++) {
          sum += coeff[counter][b] * presses[b];
        }
        if (sum !== machine.joltage[counter]) {
          return;
        }
      }
      best_total = current_sum;
      return;
    }

    // Calculate bounds for current button
    let min_needed = 0;
    let max_needed = 200; // Start with a generous bound

    // Check all counters to see what this button needs
    for (let counter = 0; counter < m; counter++) {
      if (coeff[counter][btn_idx] === 0) continue;

      // Calculate remaining target for this counter after previous buttons
      let remaining = machine.joltage[counter];
      for (let b = 0; b < btn_idx; b++) {
        remaining -= coeff[counter][b] * presses[b];
      }

      // This counter is now determined by future buttons, so we can only get a loose bound
      if (remaining > 0) {
        min_needed = Math.max(min_needed, Math.ceil(remaining / coeff[counter][btn_idx]));
      }
    }

    // Search with early termination
    for (let press_count = 0; press_count <= Math.min(max_needed, best_total - current_sum); press_count++) {
      presses[btn_idx] = press_count;
      backtrack(btn_idx + 1, presses, current_sum + press_count);
    }
  }

  backtrack(0, new Array(n).fill(0), 0);

  return best_total === Infinity ? -1 : best_total;
}

export function solve(input: string): number {
  const machines = parseInput(input);
  let total = 0;

  for (const machine of machines) {
    const presses = solveMachine(machine);
    if (presses === -1) {
      console.error('Machine has no solution!');
      return -1;
    }
    total += presses;
  }

  return total;
}

if (require.main === module) {
  const inputFile = process.argv[2] || './src/day09/input09.txt';
  let data: string;
  try {
    data = fs.readFileSync(inputFile, 'utf8');
  } catch (e) {
    try {
      data = fs.readFileSync('./src/day09/input09.txt', 'utf8');
    } catch (e2) {
      data = fs.readFileSync('./input09.txt', 'utf8');
    }
  }
  console.log(solve(data));
}
