/*
 BFS algorithm for grid-based pathfinding (unweighted)
 Returns an object with { visitedOrder: [...cells], path: [...cells] }
 Each cell is represented as {row, col}
*/

export function bfs(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({length: rows}, ()=>Array(cols).fill(false));
  const parent = Array.from({length: rows}, ()=>Array(cols).fill(null));
  const queue = [start];
  visited[start.row][start.col] = true;
  const visitedOrder = [];

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while (queue.length) {
    const cur = queue.shift();
    visitedOrder.push(cur);
    if (cur.row === end.row && cur.col === end.col) break;
    for (const [dr,dc] of dirs) {
      const nr = cur.row + dr, nc = cur.col + dc;
      if (nr>=0 && nr<rows && nc>=0 && nc<cols && !visited[nr][nc] && grid[nr][nc].type !== 'wall') {
        visited[nr][nc] = true;
        parent[nr][nc] = cur;
        queue.push({row: nr, col: nc});
      }
    }
  }

  // reconstruct path
  const path = [];
  let cur = end;
  if (parent[cur.row] && parent[cur.row][cur.col] !== null) {
    while (!(cur.row === start.row && cur.col === start.col)) {
      path.push(cur);
      cur = parent[cur.row][cur.col];
    }
    path.push(start);
    path.reverse();
  }

  return { visitedOrder, path };
}
