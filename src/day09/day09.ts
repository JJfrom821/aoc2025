import * as fs from 'fs';

interface Machine {
  target: boolean[];
  buttons: number[][];
}

function parseInput(input: string): Machine[] {
  const lines = input.replace(/\r/g, '').split('\n').filter(l => l.length > 0);
  const machines: Machine[] = [];

  for (const line of lines) {
    // Parse target lights: [.##.]
    const targetMatch = line.match(/\[([\\.#]+)\]/);
    const targetStr = targetMatch![1];
    const target = targetStr.split('').map(c => c === '#');

    // Parse buttons: (0,3) (1,3) etc
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

    machines.push({ target, buttons });
  }

  return machines;
}

/**
 * Solve lights out using Gaussian elimination over GF(2)
 * Returns the minimum number of button presses, or -1 if impossible
 */
function solveMachine(machine: Machine): number {
  const n = machine.target.length;
  const m = machine.buttons.length;

  // Build augmented matrix for Gaussian elimination over GF(2)
  // Each row represents one light
  // Columns 0..m-1 represent buttons, column m represents the target
  const matrix: number[][] = [];

  for (let light = 0; light < n; light++) {
    const row = new Array(m + 1).fill(0);

    // Fill in which buttons affect this light
    for (let btn = 0; btn < m; btn++) {
      if (machine.buttons[btn].includes(light)) {
        row[btn] = 1;
      }
    }

    // Target state for this light
    row[m] = machine.target[light] ? 1 : 0;

    matrix.push(row);
  }

  // Gaussian elimination over GF(2) to RREF
  let pivot_row = 0;
  const pivot_col: number[] = new Array(m).fill(-1); // pivot_col[btn] = which row pivots on button btn

  for (let col = 0; col < m && pivot_row < n; col++) {
    // Find pivot
    let found = false;
    for (let row = pivot_row; row < n; row++) {
      if (matrix[row][col] === 1) {
        // Swap rows
        [matrix[pivot_row], matrix[row]] = [matrix[row], matrix[pivot_row]];
        found = true;
        break;
      }
    }

    if (!found) continue;

    pivot_col[col] = pivot_row;

    // Eliminate all other 1s in this column (including above)
    for (let row = 0; row < n; row++) {
      if (row !== pivot_row && matrix[row][col] === 1) {
        for (let c = 0; c <= m; c++) {
          matrix[row][c] ^= matrix[pivot_row][c];
        }
      }
    }

    pivot_row++;
  }

  // Check for inconsistencies
  for (let row = pivot_row; row < n; row++) {
    if (matrix[row][m] === 1) {
      return -1; // Impossible
    }
  }

  // Identify free variables (buttons without pivots)
  const free_vars: number[] = [];
  for (let col = 0; col < m; col++) {
    if (pivot_col[col] === -1) {
      free_vars.push(col);
    }
  }

  // If there are free variables, try all 2^k combinations and find minimum
  if (free_vars.length > 0) {
    let min_presses = Infinity;

    for (let mask = 0; mask < (1 << free_vars.length); mask++) {
      const solution = new Array(m).fill(0);

      // Set free variables according to mask
      for (let i = 0; i < free_vars.length; i++) {
        solution[free_vars[i]] = (mask >> i) & 1;
      }

      // Back-substitute to determine pivot variables
      for (let col = m - 1; col >= 0; col--) {
        if (pivot_col[col] !== -1) {
          const row = pivot_col[col];
          let val = matrix[row][m];
          for (let c = col + 1; c < m; c++) {
            val ^= matrix[row][c] & solution[c];
          }
          solution[col] = val;
        }
      }

      const presses = solution.reduce((a, b) => a + b, 0);
      min_presses = Math.min(min_presses, presses);
    }

    return min_presses;
  }

  // No free variables - unique solution
  const solution = new Array(m).fill(0);
  for (let col = m - 1; col >= 0; col--) {
    if (pivot_col[col] !== -1) {
      const row = pivot_col[col];
      let val = matrix[row][m];
      for (let c = col + 1; c < m; c++) {
        val ^= matrix[row][c] & solution[c];
      }
      solution[col] = val;
    }
  }

  return solution.reduce((a, b) => a + b, 0);
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
