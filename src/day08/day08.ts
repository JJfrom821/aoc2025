import * as fs from 'fs';

/**
 * Union-Find data structure for tracking connected components
 */
class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const px = this.find(x);
    const py = this.find(y);

    if (px === py) return false; // already in same set

    // union by rank
    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }

    return true;
  }
}

interface Junction {
  x: number;
  y: number;
  z: number;
  id: number;
}

function parseInput(input: string): Junction[] {
  const lines = input.replace(/\r/g, '').split('\n').filter(l => l.length > 0);
  return lines.map((line, id) => {
    const [x, y, z] = line.split(',').map(s => parseInt(s, 10));
    return { x, y, z, id };
  });
}

function distance(a: Junction, b: Junction): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz; // squared distance (no need for sqrt)
}

export function solve(input: string): number {
  const junctions = parseInput(input);
  const n = junctions.length;

  // Generate all pairs with their distances
  const pairs: Array<{ dist: number; i: number; j: number }> = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({
        dist: distance(junctions[i], junctions[j]),
        i,
        j,
      });
    }
  }

  // Sort pairs by distance
  pairs.sort((a, b) => a.dist - b.dist);

  // Connect the 1000 closest pairs
  const uf = new UnionFind(n);
  const connectionsToMake = Math.min(1000, pairs.length);

  for (let k = 0; k < connectionsToMake; k++) {
    uf.union(pairs[k].i, pairs[k].j);
  }

  // Count circuit sizes
  const componentSizes = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    componentSizes.set(root, (componentSizes.get(root) || 0) + 1);
  }

  // Get the three largest circuit sizes and multiply them
  const sizes = Array.from(componentSizes.values()).sort((a, b) => b - a);
  return sizes[0] * sizes[1] * sizes[2];
}

if (require.main === module) {
  const p = './src/day08/input08.txt'.replace('./', './');
  let data: string;
  try {
    data = fs.readFileSync(p, 'utf8');
  } catch (e) {
    data = fs.readFileSync('./input08.txt', 'utf8');
  }
  console.log(solve(data));
}
