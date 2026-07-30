# Sudoku Solver

A fast, interactive web-based Sudoku solver built with React and Tailwind CSS on the Next.js framework. The app allows you to input custom Sudoku puzzles and solves them instantly using Donald Knuth's **Dancing Links (DLX)** algorithm.

## Features

- **Blazing Fast Solving:** Uses the highly efficient Algorithm X / Dancing Links (DLX) to find the solution instantly.
- **Intuitive Keyboard Navigation:** Fully supports keyboard inputs for a seamless user experience:
  - `Arrow Keys`: Navigate through the grid.
  - `1-9`: Input numbers into the cells.
  - `0` or `Backspace`: Clear the selected cell.
  - `Escape`: Deselect the current cell.
- **Responsive UI:** Styled with Tailwind CSS to ensure the 9x9 grid scales beautifully across mobile, tablet, and desktop screens.
- **Clean Design:** Features standard Sudoku 3x3 sub-grid borders, active cell highlighting, and simple run/clear controls.

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Algorithm:** Dancing Links (Algorithm X)

## How to Use

1. **Input the Puzzle:** Click on any cell in the grid to select it.
2. **Enter Numbers:** Type numbers based on your puzzle. Use the arrow keys to quickly move around the board.
3. **Solve:** Click the **Run** button to instantly calculate and display the solution.
4. **Reset:** Click the **Clear** button to wipe the board completely and start over.

## Known Issues
There is no way of inputting numbers from mobile. I'm working on a fix, don't worry!
