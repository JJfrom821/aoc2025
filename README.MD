# Advent of Code 2025 - TypeScript Solutions

A collection of TypeScript solutions for [Advent of Code 2025](https://adventofcode.com/2025), solving one problem per day as a festive coding challenge.

## 📋 Overview

Each day's challenge is organized in its own directory with:
- **`dayxx.ts`** - Main TypeScript solution
- **`dayxx_test.js`** - Test runner with example verification
- **`inputxx.txt`** - Puzzle input data

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

This installs TypeScript and ts-node for running TypeScript files directly.

## 📖 Running Solutions

### Direct Execution with ts-node
Run TypeScript files directly without compilation:
```bash
npx ts-node dayxx.ts inputxx.txt
```

## 🧪 Testing

Each day includes a test file that validates the solution against known examples:

```bash
# Test individual days
node day01_test.js
node day02/day02_test.js

# Or run all tests
for day in day*/day*_test.js; do echo "Testing $day:"; node "$day"; done
```

## 📦 Dependencies

- **TypeScript** - For type-safe solutions
- **ts-node** - To run TypeScript directly without compilation
- **fs** - File system module (built-in Node.js)

## 🎄 Progress

- [x] Day 1: Dial Rotation
- [x] Day 2: Invalid ID Detection
- [ ] Day 3 - 25: Coming soon...

## 💡 Notes

- All solutions use **BigInt** where necessary to handle large numbers
- Input files use `.txt` extension and should be in the same directory as their solution
- Each solution exports core functions for reuse in test files
- Error handling includes checks for missing input files

## 🔗 Resources

- [Advent of Code 2025](https://adventofcode.com/2025)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 📝 License

This project is for educational purposes as part of the Advent of Code challenge.

---

Happy coding! 🎅✨
