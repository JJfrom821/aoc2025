import * as fs from 'fs';

/**
 * Method 0x434C49434B: Count all times the dial points at 0,
 * including intermediate hits during rotations.
 * - For each rotation, calculate how many times during that rotation
 *   the dial passes through position 0 (modulo 100).
 * - Sum these counts across all rotations.
 */
function solve(input: string): number {
	const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	let pos = 50; // starting position (0..99)
	let total = 0;

	for (const line of lines) {
		const dir = line[0];
		const dist = Number(line.slice(1));
		if (!Number.isFinite(dist) || dist <= 0) continue;

		// Calculate first step k (1-based) when dial equals 0 during this rotation
		let firstK: number;
		if (dir === 'R') {
			// Moving right: (pos + k) % 100 === 0 => k ≡ -pos (mod 100)
			firstK = (100 - (pos % 100)) % 100;
		} else if (dir === 'L') {
			// Moving left: (pos - k) % 100 === 0 => k ≡ pos (mod 100)
			firstK = pos % 100;
		} else {
			continue; // ignore malformed lines
		}

		// If firstK === 0, the first hit is at k = 100 (wrap-around)
		if (firstK === 0) firstK = 100;

		// Count how many times we hit 0 during this rotation
		if (firstK <= dist) {
			// One hit at firstK, then every +100 steps while <= dist
			total += Math.floor((dist - firstK) / 100) + 1;
		}

		// Update position after the full rotation
		if (dir === 'R') {
			pos = (pos + dist) % 100;
		} else {
			pos = ((pos - dist) % 100 + 100) % 100;
		}
	}

	return total;
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

