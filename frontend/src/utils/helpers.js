/*
 helpers.js
 - Helper functions used across frontend:
   - makeEmptyGrid
   - makeRandomGrid
   - deepCopyGrid
*/

export function makeEmptyGrid(rows, cols) {
  const grid = [];
  for (let r=0;r<rows;r++) {
    const row = [];
    for (let c=0;c<cols;c++) {
      row.push({ row: r, col: c, type: 'empty', weight: 1 });
    }
    grid.push(row);
  }
  return grid;
}

/*
 create a random grid with some walls and return start/end
 density controls wall probability
 if withStartEnd true, place random start/end non-wall cells
*/
export function makeRandomGrid(rows, cols, density=0.18, withStartEnd=true) {
  const g = makeEmptyGrid(rows, cols);
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
    if (Math.random() < density) g[r][c].type = 'wall';
  }
  let start = { row: 0, col: 0 }, end = { row: rows-1, col: cols-1 };
  if (withStartEnd) {
    // choose two random non-wall cells
    function randCell() {
      while (true) {
        const rr = Math.floor(Math.random()*rows);
        const cc = Math.floor(Math.random()*cols);
        if (g[rr][cc].type !== 'wall') return { row: rr, col: cc };
      }
    }
    start = randCell();
    end = randCell();
    g[start.row][start.col].type = 'start';
    g[end.row][end.col].type = 'end';
  }
  return { grid: g, start, end };
}

export function deepCopyGrid(grid) {
  return grid.map(row => row.map(cell => ({...cell})));
}
