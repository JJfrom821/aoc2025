import * as fs from 'fs';

function solve(input: string): number {
	const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	let pos = 50; // starting position
	let zeros = 0;

	for (const line of lines) {
		const dir = line[0];
		const dist = Number(line.slice(1));
		if (!Number.isFinite(dist)) continue;

		if (dir === 'R') {
			pos = (pos + dist) % 100;
		} else if (dir === 'L') {
			pos = ((pos - dist) % 100 + 100) % 100;
		} else {
			// ignore malformed lines
			continue;
		}

		if (pos === 0) zeros++;
	}

	return zeros;
}

function main(): void {
	const arg = process.argv[2];
	let input: string;
	try {
		if (arg) input = fs.readFileSync(arg, 'utf8');
		else input = fs.readFileSync(0, 'utf8'); // stdin
	} catch (e) {
		console.error('Failed to read input:', e instanceof Error ? e.message : e);
		process.exit(1);
		return;
	}

	const result = solve(input);
	console.log(result);
}

if (require.main === module) main();

