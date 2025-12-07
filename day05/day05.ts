import * as fs from 'fs';

/**
 * Parse a single range like "3-5" into [start, end]
 */
function parseRange(line: string): [number, number] {
	const [a, b] = line.split('-').map(s => parseInt(s, 10));
	return [a, b];
}

/**
 * Merge an array of inclusive ranges [start,end] that may overlap.
 * Returns a new array of non-overlapping, sorted ranges.
 */
export function mergeRanges(ranges: Array<[number, number]>): Array<[number, number]> {
	if (ranges.length === 0) return [];
	ranges.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
	const out: Array<[number, number]> = [];
	let [curL, curR] = ranges[0];
	for (let i = 1; i < ranges.length; i++) {
		const [l, r] = ranges[i];
		if (l <= curR + 1) {
			// overlap or adjacent -> extend
			curR = Math.max(curR, r);
		} else {
			out.push([curL, curR]);
			curL = l; curR = r;
		}
	}
	out.push([curL, curR]);
	return out;
}

/**
 * Count total number of unique IDs covered by all ranges.
 */
export function countFresh(ranges: Array<[number, number]>): number {
	const merged = mergeRanges(ranges);
	let count = 0;
	for (const [l, r] of merged) {
		count += r - l + 1; // inclusive range
	}
	return count;
}

/**
 * solve - parse full file contents and return the number of fresh ids
 */
export function solve(input: string): number {
	// split into two sections separated by a blank line
	const parts = input.split(/\r?\n\s*\r?\n/);
	const rangesPart = parts[0] ?? '';

	const ranges: Array<[number, number]> = rangesPart
		.split(/\r?\n/)
		.map(s => s.trim())
		.filter(Boolean)
		.map(parseRange);

	return countFresh(ranges);
}

// If executed directly, read `input05.txt` in the same directory and print result
if (require.main === module) {
	const p = './day05/input05.txt'.replace('./', './');
	let data: string;
	try {
		data = fs.readFileSync(p, 'utf8');
	} catch (e) {
		// try sibling path
		data = fs.readFileSync('./input05.txt', 'utf8');
	}
	console.log(solve(data));
}

