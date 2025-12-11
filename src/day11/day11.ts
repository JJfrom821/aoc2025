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

function countPaths(graph: Map<string, string[]>, start: string, end: string): number {
  let total = 0;
  function dfs(node: string) {
    if (node === end) {
      total++;
      return;
    }
    const nexts = graph.get(node) || [];
    for (const next of nexts) {
      dfs(next);
    }
  }
  dfs(start);
  return total;
}

if (require.main === module) {
  const inputFile = process.argv[2] || './src/day11/inputqq.txt';
  const input = fs.readFileSync(inputFile, 'utf8');
  const graph = parseInput(input);
  const answer = countPaths(graph, 'you', 'out');
  console.log(answer);
}
