import * as fs from 'fs';

interface Machine {
  joltage: number[];
  buttons: number[][];
}

function parseInput(input: string): Machine[] {
  const lines = input.replace(/\r/g, '').split('\n').filter(l => l.length > 0);
  const machines: Machine[] = [];

  for (const line of lines) {
    const joltageMatch = line.match(/\{([0-9,]+)\}/);
    const joltageStr = joltageMatch![1];
    const joltage = joltageStr.split(',').map(s => parseInt(s, 10));

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

    machines.push({ joltage, buttons });
  }

  return machines;
}

// Solve using integer linear algebra + bounded search (since AoC inputs are small)
function solveMachine(machine: Machine): number {
  const m = machine.joltage.length;
  const n = machine.buttons.length;
  const matrix: number[][] = [];
  for (let counter = 0; counter < m; counter++) {
    const row = new Array(n).fill(0);
    for (let btn = 0; btn < n; btn++) {
      row[btn] = machine.buttons[btn].filter(c => c === counter).length;
    }
    matrix.push(row);
  }

  let best = Infinity;
  function dfs(idx: number, presses: number[], sum: number) {
    if (sum >= best) return;
    if (idx === n) {
      // Check if solution is valid
      for (let i = 0; i < m; i++) {
        let total = 0;
        for (let j = 0; j < n; j++) total += matrix[i][j] * presses[j];
        if (total !== machine.joltage[i]) return;
      }
      best = sum;
      return;
    }
    // Try pressing this button 0..max times
    let maxPress = Math.max(...machine.joltage) + 1;
    for (let p = 0; p <= maxPress; p++) {
      presses[idx] = p;
      dfs(idx + 1, presses, sum + p);
    }
  }
  dfs(0, new Array(n).fill(0), 0);
  return best;
}

export function solve(input: string): number {
  const machines = parseInput(input);
  let total = 0;
  for (const machine of machines) {
    const presses = solveMachine(machine);
    if (presses === Infinity) {
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