import * as fs from 'fs';

interface Tile {
  x: number;
  y: number;
}

function parseInput(input: string): Tile[] {
  const lines = input.replace(/\r/g, '').split('\n').filter(l => l.length > 0);
  return lines.map(line => {
    const [x, y] = line.split(',').map(s => parseInt(s, 10));
    return { x, y };
  });
}

export function solve(input: string): number {
  const tiles = parseInput(input);
  
  let maxArea = 0;
  
  // Try all pairs of tiles as opposite corners
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const tile1 = tiles[i];
      const tile2 = tiles[j];
      
      // Calculate rectangle with these as opposite corners
      // The rectangle spans from min to max in both x and y
      const minX = Math.min(tile1.x, tile2.x);
      const maxX = Math.max(tile1.x, tile2.x);
      const minY = Math.min(tile1.y, tile2.y);
      const maxY = Math.max(tile1.y, tile2.y);
      
      // Area is (width + 1) * (height + 1) to include the tiles at the boundaries
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const area = width * height;
      
      maxArea = Math.max(maxArea, area);
    }
  }
  
  return maxArea;
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
