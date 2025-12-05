const fs = require('fs');
const path = require('path');
// Implement the helpers in JS (do not require the TS file)
function parseInputJS(raw) {
  let s = raw.trim();
  if (s.startsWith('```')) {
    const parts = s.split('\n');
    parts.shift();
    if (parts[parts.length - 1].startsWith('```')) parts.pop();
    s = parts.join('\n');
  }
  return s.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
}

function countAccessibleJS(lines) {
  const rows = lines.length;
  if (rows === 0) return 0;
  const cols = lines[0].length;
  const grid = lines.map(l => l.split(''));
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  let accessible = 0;
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (grid[r][c] !== '@') continue;
      let neighbors = 0;
      for (const [dr,dc] of dirs){
        const nr = r+dr, nc = c+dc;
        if (nr<0||nr>=rows||nc<0||nc>=cols) continue;
        if (grid[nr][nc] === '@') neighbors++;
      }
      if (neighbors < 4) accessible++;
    }
  }
  return accessible;
}

const inputPath = path.join(__dirname, 'input04.txt');
if (!fs.existsSync(inputPath)) {
  console.error('Input file not found:', inputPath);
  process.exit(1);
}
const raw = fs.readFileSync(inputPath, 'utf8');
const lines = parseInputJS(raw);
const result = countAccessibleJS(lines);
console.log(result);
