import * as fs from 'fs';

/**
 * parseInput
 * - Accepts raw text from the puzzle input file.
 * - Some inputs may be wrapped in markdown-style code fences (```),
 *   so we remove those if present and then split into non-empty lines.
 * - Returns an array of trimmed strings, each representing a grid row.
 */
export function parseInput(raw: string): string[] {
  // Normalize whitespace and detect opening code fence
  let s = raw.trim();
  if (s.startsWith('```')) {
    // If the input was pasted with fences, drop the first and last fence lines.
    const parts = s.split('\n');
    parts.shift(); // remove the opening ``` line
    if (parts[parts.length - 1].startsWith('```')) parts.pop(); // remove closing ``` if present
    s = parts.join('\n');
  }

  // Split into lines, trim each line and discard blank lines.
  return s.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
}


/**
 * countAccessible
 * - Given an array of grid lines (each line is a string of '.' and '@'),
 *   count how many '@' cells (rolls of paper) are accessible by forklifts.
 * - A roll is accessible if the number of '@'s in the eight surrounding
 *   neighbor cells is strictly less than 4.
 * - We iterate every cell, skip non-'@' cells early, and then check the
 *   eight neighbors (with bounds checks) counting adjacent '@' characters.
 */
export function countAccessible(gridLines: string[]): number {
  const rows = gridLines.length;
  if (rows === 0) return 0; // empty input
  const cols = gridLines[0].length;

  // Convert each line to an array of characters for easy indexing.
  const grid = gridLines.map(l => l.split(''));

  // Eight directional offsets (rowDelta, colDelta). We exclude the center (0,0).
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /*skip center*/ [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  let accessible = 0;

  // Walk the whole grid
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Fast skip: only evaluate if this cell contains a roll ('@')
      if (grid[r][c] !== '@') continue;

      // Count adjacent rolls
      let neighbors = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        // Skip out-of-bounds neighbors (edges and corners of the grid)
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        // Increment neighbor count when we see another roll
        if (grid[nr][nc] === '@') neighbors++;
      }

      // Forklifts can access this roll when fewer than 4 neighboring rolls exist
      if (neighbors < 4) accessible++;
    }
  }

  return accessible;
}


/**
 * main
 * - Simple CLI runner: reads the input file (default `./input04.txt`),
 *   parses it, computes the accessible-roll count and prints the result.
 */
function main(): void {
  const inputPath = process.argv[2] || './input04.txt';
  let raw: string;
  try {
    raw = fs.readFileSync(inputPath, 'utf8');
  } catch (e) {
    console.error('Failed to read input:', e instanceof Error ? e.message : e);
    process.exit(1);
    return;
  }

  const lines = parseInput(raw);
  const result = countAccessible(lines);
  console.log(result);
}

if (require.main === module) main();
