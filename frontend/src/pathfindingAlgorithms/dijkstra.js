/*
 Dijkstra algorithm for grid with weights
 - weight cells have .weight property (default 1)
 - returns visitedOrder and path
*/

export function dijkstra(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dist = Array.from({length: rows}, ()=>Array(cols).fill(Infinity));
  const visited = Array.from({length: rows}, ()=>Array(cols).fill(false));
  const parent = Array.from({length: rows}, ()=>Array(cols).fill(null));
  const visitedOrder = [];

  dist[start.row][start.col] = 0;

  function neighbors(r,c) {
    return [[1,0],[-1,0],[0,1],[0,-1]].map(([dr,dc]) => [r+dr, c+dc]).filter(([nr,nc]) => nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc].type !== 'wall');
  }

  while (true) {
    let min = Infinity, u = null;
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      if (!visited[r][c] && dist[r][c] < min) {
        min = dist[r][c]; u = {row:r,col:c};
      }
    }
    if (!u) break;
    visited[u.row][u.col] = true;
    visitedOrder.push(u);
    if (u.row === end.row && u.col === end.col) break;

    for (const [nr,nc] of neighbors(u.row, u.col)) {
      const w = grid[nr][nc].weight || 1;
      if (dist[u.row][u.col] + w < dist[nr][nc]) {
        dist[nr][nc] = dist[u.row][u.col] + w;
        parent[nr][nc] = u;
      }
    }
  }

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
