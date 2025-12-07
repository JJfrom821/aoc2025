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
 * Count how many ids fall into any of the given ranges.
 */
export function countFresh(ids: number[], ranges: Array<[number, number]>): number {
	const merged = mergeRanges(ranges);
	let count = 0;
	for (const id of ids) {
		// binary search over merged ranges
		let lo = 0, hi = merged.length - 1;
		let found = false;
		while (lo <= hi) {
			const mid = (lo + hi) >> 1;
			const [l, r] = merged[mid];
			if (id < l) hi = mid - 1;
			else if (id > r) lo = mid + 1;
			else { found = true; break; }
		}
		if (found) count++;
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
	const idsPart = parts[1] ?? '';

	const ranges: Array<[number, number]> = rangesPart
		.split(/\r?\n/)
		.map(s => s.trim())
		.filter(Boolean)
		.map(parseRange);

	const ids: number[] = idsPart
		.split(/\r?\n/)
		.map(s => s.trim())
		.filter(Boolean)
		.map(s => parseInt(s, 10));

	return countFresh(ids, ranges);
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

