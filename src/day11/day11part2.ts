import * as fs from 'fs';

function parseInput(input: string): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const line of input.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [from, rest] = line.split(':');
    const tos = rest.trim().split(/\s+/);
    graph.set(from.trim(), tos);
  }
  return graph;
}

function countSpecialPaths(graph: Map<string, string[]>, start: string, end: string, mustVisit: string[]): number {
  let total = 0;
  function dfs(node: string, visited: Set<string>) {
    if (node === end) {
      if (mustVisit.every(v => visited.has(v))) {
        total++;
      }
      return;
    }
    const nexts = graph.get(node) || [];
    for (const next of nexts) {
      dfs(next, new Set([...visited, next]));
    }
  }
  dfs(start, new Set([start]));
  return total;
}

if (require.main === module) {
  const inputFile = process.argv[2] || './src/day11/input11.txt';
  const input = fs.readFileSync(inputFile, 'utf8');
  const graph = parseInput(input);
  const answer = countSpecialPaths(graph, 'svr', 'out', ['dac', 'fft']);
  console.log(answer);
}
