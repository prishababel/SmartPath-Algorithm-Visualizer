/*
 ml/trainer.js
 - For the demo, we generate synthetic training examples on the client:
   create random grids, compute shortest path with BFS (server or local), then train model to map grid->path.
 - For performance and simplicity we generate small grids (e.g., 10x10) for training.
 - This is demo/mock training; training is intentionally small so the UI remains responsive.
*/

import * as tf from '@tensorflow/tfjs';
import { createModel, gridToInput, pathToTarget } from './model';
import { bfs } from '../pathfindingAlgorithms/bfs';
import { makeRandomGrid } from '../utils/helpers';

// Train a model in-browser on synthetic examples.
// Returns the trained model.
export async function trainDemoModel(rows=10, cols=10, examples=80, epochs=6) {
  const inputSize = rows * cols;
  const model = createModel(inputSize);

  const inputs = [];
  const targets = [];

  for (let i=0;i<examples;i++) {
    const { grid, start, end } = makeRandomGrid(rows, cols, 0.18, true);
    const { path } = bfs(grid, start, end);
    const x = gridToInput(grid);
    const y = pathToTarget(grid, path);
    inputs.push(x);
    targets.push(y);
  }

  const xs = tf.tensor2d(inputs, [inputs.length, inputSize]);
  const ys = tf.tensor2d(targets, [targets.length, inputSize]);

  // small training loop
  await model.fit(xs, ys, {
    epochs,
    batchSize: Math.min(16, inputs.length),
    verbose: 0
  });

  xs.dispose(); ys.dispose();
  return model;
}

/*
 predict(model, grid):
 - runs model.predict and returns an array of cell indices predicted to be path (threshold 0.5)
*/
export async function predictPath(model, grid, threshold=0.5) {
  const input = gridToInput(grid);
  const inputTensor = tf.tensor2d([input], [1, input.length]);
  const out = model.predict(inputTensor);
  const data = await out.data();
  inputTensor.dispose(); out.dispose();
  const rows = grid.length, cols = grid[0].length;
  const path = [];
  for (let i=0;i<data.length;i++) {
    if (data[i] >= threshold) {
      path.push({ row: Math.floor(i/cols), col: i % cols });
    }
  }
  return path;
}
