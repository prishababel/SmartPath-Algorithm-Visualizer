import React, { useEffect, useState, useRef } from 'react';
import GridCell from './GridCell';
import Controls from './Controls';
import { makeEmptyGrid, deepCopyGrid } from '../utils/helpers';
import { bfs } from '../pathfindingAlgorithms/bfs';
import { dfs } from '../pathfindingAlgorithms/dfs';
import { dijkstra } from '../pathfindingAlgorithms/dijkstra';
import { trainDemoModel, predictPath } from '../ml/trainer';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

/*
 PathfindingVisualizer.jsx
 - Main UI for pathfinding:
   - Grid interactive: set walls, start, end, weights
   - Controls to select algorithm, speed, run, reset
   - Toggle ML: when toggled, either use in-browser TF.js model prediction or backend /predict
 - ML integration:
   - When user clicks "Train ML (demo)", we run a quick in-browser mock training using synthetic grids and BFS labels (trainer).
   - Once trained, "Use ML" toggles will request predictions from the trained model (client side).
   - The code also shows an example of calling backend /predict as a fallback.
*/

const ROWS = 18;
const COLS = 28;

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(makeEmptyGrid(ROWS, COLS));
  const [start, setStart] = useState({row: 3, col: 3});
  const [end, setEnd] = useState({row: ROWS - 4, col: COLS - 4});
  const [mouseDown, setMouseDown] = useState(false);
  const [currentTool, setCurrentTool] = useState('wall'); // wall, start, end, weight
  const [algo, setAlgo] = useState('bfs');
  const [speed, setSpeed] = useState(30);
  const [running, setRunning] = useState(false);
  const [mlEnabled, setMlEnabled] = useState(false);
  const [mlModel, setMlModel] = useState(null);
  const runningRef = useRef(false);

  useEffect(() => {
    resetGrid();
    // place start and end
    setGrid(prev => {
      const g = deepCopyGrid(prev);
      g[start.row][start.col].type = 'start';
      g[end.row][end.col].type = 'end';
      return g;
    });
    // cleanup model on unmount
    return () => { if (mlModel) { try{ mlModel.dispose(); }catch{} } };
  }, []);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  function resetGrid() {
    const g = makeEmptyGrid(ROWS, COLS);
    g[start.row][start.col].type = 'start';
    g[end.row][end.col].type = 'end';
    setGrid(g);
  }

  function handleToggleCell(cell) {
    if (running) return;
    setGrid(prev => {
      const g = deepCopyGrid(prev);
      const c = g[cell.row][cell.col];
      if (currentTool === 'wall') {
        if (c.type === 'start' || c.type === 'end') return g;
        c.type = c.type === 'wall' ? 'empty' : 'wall';
      } else if (currentTool === 'start') {
        // move start
        const old = g[start.row][start.col];
        if (old) old.type = 'empty';
        c.type = 'start';
        setStart({row: c.row, col: c.col});
      } else if (currentTool === 'end') {
        const old = g[end.row][end.col];
        if (old) old.type = 'empty';
        c.type = 'end';
        setEnd({row: c.row, col: c.col});
      } else if (currentTool === 'weight') {
        c.type = c.type === 'weight' ? 'empty' : 'weight';
        c.weight = c.type === 'weight' ? 5 : 1;
      }
      return g;
    });
  }

  async function runAlgorithm() {
    if (running) return;
    setRunning(true);
    // choose algorithm
    const gridCopy = deepCopyGrid(grid);
    let result = { visitedOrder: [], path: [] };

    if (mlEnabled && mlModel) {
      // Use in-browser ML model to predict path
      const predicted = await predictPath(mlModel, gridCopy, 0.5);
      // predicted is a set of cells; convert to visited order and path (we'll treat predictions as path)
      result.path = predicted;
      result.visitedOrder = predicted; // for visualization we'll treat predicted set as visited too
    } else if (mlEnabled && !mlModel) {
      // fallback: call backend predict endpoint (simple BFS fallback implemented in backend)
      try {
        const resp = await axios.post('http://127.0.0.1:5000/predict', { grid: gridCopy, start, end });
        const predicted = resp.data.path || [];
        result.path = predicted;
        result.visitedOrder = predicted;
      } catch (err) {
        console.warn('Backend predict failed, falling back to BFS client-side', err);
        result = bfs(gridCopy, start, end);
      }
    } else {
      if (algo === 'bfs') result = bfs(gridCopy, start, end);
      if (algo === 'dfs') result = dfs(gridCopy, start, end);
      if (algo === 'dijkstra') result = dijkstra(gridCopy, start, end);
    }

    // visualize visitedOrder then path
    for (let i=0;i<result.visitedOrder.length;i++) {
      if (!runningRef.current) break;
      const cell = result.visitedOrder[i];
      setGrid(prev => {
        const g = deepCopyGrid(prev);
        const typeBefore = g[cell.row][cell.col].type;
        if (typeBefore === 'empty' || typeBefore === 'weight') g[cell.row][cell.col].type = 'visited';
        return g;
      });
      await new Promise(res => setTimeout(res, Math.max(5, speed)));
    }

    for (let i=0;i<result.path.length;i++) {
      if (!runningRef.current) break;
      const cell = result.path[i];
      setGrid(prev => {
        const g = deepCopyGrid(prev);
        const t = g[cell.row][cell.col].type;
        if (t !== 'start' && t !== 'end') g[cell.row][cell.col].type = 'path';
        return g;
      });
      await new Promise(res => setTimeout(res, Math.max(10, speed)));
    }

    setRunning(false);
  }

  function handleClearVisited() {
    setGrid(prev => {
      const g = deepCopyGrid(prev);
      for (let r=0;r<g.length;r++) for (let c=0;c<g[0].length;c++) {
        if (g[r][c].type === 'visited' || g[r][c].type === 'path') g[r][c].type = 'empty';
      }
      g[start.row][start.col].type = 'start';
      g[end.row][end.col].type = 'end';
      return g;
    });
  }

  async function handleTrainML() {
    if (mlModel) {
      // free model if exists
      try { mlModel.dispose(); } catch {}
      setMlModel(null);
      setMlEnabled(false);
    }
    const model = await trainDemoModel(10, 10, 60, 6); // small demo train
    setMlModel(model);
    alert('ML demo model trained in-browser (small). Toggle "Use ML" to enable predictions.');
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">Pathfinding Visualizer</h2>
          <p className="text-sm text-gray-500">BFS · DFS · Dijkstra · Toggle ML-predicted paths</p>
        </div>

        <div className="flex flex-col gap-3">
          <Controls>
            <div className="flex items-center gap-2">
              <label className="text-sm">Tool:</label>
              <select value={currentTool} onChange={(e) => setCurrentTool(e.target.value)} className="px-2 py-1 rounded">
                <option value="wall">Wall</option>
                <option value="start">Move Start</option>
                <option value="end">Move End</option>
                <option value="weight">Weight</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Algorithm:</label>
              <select value={algo} onChange={(e) => setAlgo(e.target.value)} className="px-2 py-1 rounded">
                <option value="bfs">BFS</option>
                <option value="dfs">DFS</option>
                <option value="dijkstra">Dijkstra</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Speed</label>
              <input type="range" min="5" max="200" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            </div>

            <div className="flex gap-2">
              <button onClick={runAlgorithm} className="px-3 py-1 bg-brand-600 text-white rounded" disabled={running}>Run</button>
              <button onClick={handleClearVisited} className="px-3 py-1 bg-gray-200 rounded">Clear</button>
              <button onClick={resetGrid} className="px-3 py-1 bg-gray-200 rounded">Reset Grid</button>
            </div>

            <div className="flex items-center gap-2">
              <input id="use-ml" type="checkbox" checked={mlEnabled} onChange={(e) => setMlEnabled(e.target.checked)} />
              <label htmlFor="use-ml" className="text-sm">Use ML-prediction</label>
              <button onClick={handleTrainML} className="px-2 py-1 bg-indigo-500 text-white rounded">Train ML (demo)</button>
            </div>
          </Controls>

          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/40 rounded border" onClick={async () => {
              try {
                await axios.post('http://127.0.0.1:5000/save-grid', { grid });
                alert('Grid saved to backend.');
              } catch (e) { alert('Save failed: ' + e.message); }
            }}>Save grid (backend)</button>

            <button className="px-3 py-1 bg-white/40 rounded border" onClick={async () => {
              try {
                const resp = await axios.get('http://127.0.0.1:5000/load-grid');
                const loaded = resp.data.grid;
                // coerce into grid shape if present
                if (loaded) setGrid(loaded);
              } catch (e) { alert('Load failed: ' + e.message); }
            }}>Load grid (backend)</button>
          </div>
        </div>
      </div>

      <div
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
      >
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {grid.map((row) =>
            row.map((cell) => (
              <div key={`${cell.row}-${cell.col}`}>
                <GridCell
                  cell={cell}
                  onToggle={() => handleToggleCell(cell)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>How ML works (demo):</strong> clicking "Train ML (demo)" creates synthetic examples on the client, trains a small TensorFlow.js model that learns to map grid layouts to path masks (based on BFS labels). Once trained you can toggle "Use ML-prediction" and the client will ask the model to predict which cells belong to the path. This is a tiny demo to show integration and does not match high-accuracy route planners.</p>
      </div>
    </div>
  );
}
