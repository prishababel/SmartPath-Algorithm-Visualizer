/*
 ml/model.js
 - Creates a simple TensorFlow.js model to predict a path-mask from a flattened grid.
 - Input: flattened grid encoding (0 empty, 1 wall, 2 start, 3 end)
 - Output: flattened probabilities for each cell indicating path membership (0..1)
 - This is a tiny demo model for local in-browser training/inference to show ML integration.
*/

import * as tf from '@tensorflow/tfjs';

// Create a small model. For demo purposes we keep it shallow.
export function createModel(inputSize) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [inputSize], units: Math.max(64, inputSize), activation: 'relu' }));
  model.add(tf.layers.dense({ units: Math.max(64, inputSize/2), activation: 'relu' }));
  model.add(tf.layers.dense({ units: inputSize, activation: 'sigmoid' })); // output per-cell probability
  model.compile({ optimizer: tf.train.adam(0.01), loss: 'binaryCrossentropy' });
  return model;
}

/*
 Utility: takes grid (2D) and converts to 1D Float32Array input for model.
 encoding: empty=0, wall=1, start=2, end=3
*/
export function gridToInput(grid) {
  const rows = grid.length, cols = grid[0].length;
  const arr = new Float32Array(rows*cols);
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
    const type = grid[r][c].type;
    const val = (type === 'empty') ? 0 : (type === 'wall') ? 1 : (type === 'start') ? 2 : (type === 'end') ? 3 : 0;
    arr[r*cols + c] = val / 3.0; // normalize between 0 and 1
  }
  return arr;
}

/*
 Convert array of path cells to target mask (0/1)
*/
export function pathToTarget(grid, path) {
  const rows = grid.length, cols = grid[0].length;
  const t = new Float32Array(rows*cols).fill(0);
  for (const p of path) {
    t[p.row * cols + p.col] = 1;
  }
  return t;
}
