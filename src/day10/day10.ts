import * as fs from 'fs';

interface Machine {
  target: boolean[];
  buttons: number[][];
}

function parseInput(input: string): Machine[] {
  const lines = input.replace(/\r/g, '').split('\n').filter(l => l.length > 0);
  const machines: Machine[] = [];

  for (const line of lines) {
    const targetMatch = line.match(/\[([.#]+)\]/);
    const targetStr = targetMatch![1];
    const target = targetStr.split('').map(c => c === '#');

    const buttonMatches = line.match(/\(([0-9,]*)\)/g)!;
    const buttons: number[][] = [];
    for (const match of buttonMatches) {
      const indices = match.slice(1, -1);
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

function solveMachine(machine: Machine): number {
  const n = machine.target.length;
  const m = machine.buttons.length;
  const matrix: number[][] = [];

  for (let light = 0; light < n; light++) {
    const row = new Array(m + 1).fill(0);
    for (let btn = 0; btn < m; btn++) {
      if (machine.buttons[btn].includes(light)) row[btn] = 1;
    }
    row[m] = machine.target[light] ? 1 : 0;
    matrix.push(row);
  }

  let pivot_row = 0;
  const pivot_col: number[] = new Array(m).fill(-1);

  for (let col = 0; col < m && pivot_row < n; col++) {
    let found = false;
    for (let row = pivot_row; row < n; row++) {
      if (matrix[row][col] === 1) {
        [matrix[pivot_row], matrix[row]] = [matrix[row], matrix[pivot_row]];
        found = true;
        break;
      }
    }
    if (!found) continue;
    pivot_col[col] = pivot_row;
    for (let row = 0; row < n; row++) {
      if (row !== pivot_row && matrix[row][col] === 1) {
        for (let c = 0; c <= m; c++) {
          matrix[row][c] ^= matrix[pivot_row][c];
        }
      }
    }
    pivot_row++;
  }

  for (let row = pivot_row; row < n; row++) {
    if (matrix[row][m] === 1) return -1;
  }

  const free_vars: number[] = [];
  for (let col = 0; col < m; col++) {
    if (pivot_col[col] === -1) free_vars.push(col);
  }

  if (free_vars.length > 0) {
    let min_presses = Infinity;
    for (let mask = 0; mask < (1 << free_vars.length); mask++) {
      const solution = new Array(m).fill(0);
      for (let i = 0; i < free_vars.length; i++) {
        solution[free_vars[i]] = (mask >> i) & 1;
      }
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
  const inputFile = process.argv[2] || './src/day10/input10.txt';
  let data: string;
  try {
    data = fs.readFileSync(inputFile, 'utf8');
  } catch (e) {
    data = fs.readFileSync('./input10.txt', 'utf8');
  }
  console.log(solve(data));
}