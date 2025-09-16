import React, { useState, useEffect, useRef } from 'react';
import { bubbleSort } from '../sortingAlgorithms/bubbleSort';
import { mergeSort } from '../sortingAlgorithms/mergeSort';
import { quickSort } from '../sortingAlgorithms/quickSort';

/*
 SortingVisualizer.jsx
 - Visualizes sorting algorithms using bars.
 - Provides UI controls: generate array, algorithm select, speed, size slider, start/reset.
 - Sorting algorithm functions return an array of steps for visualization.
*/

const DEFAULT_SIZE = 40;
const DEFAULT_SPEED = 50; // ms per step

export default function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [algo, setAlgo] = useState('bubble');
  const [running, setRunning] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    generateArray(size);
    // cleanup timeouts on unmount
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function generateArray(n = size) {
    clearTimeout(timeoutRef.current);
    setRunning(false);
    const arr = Array.from({length: n}, () => Math.floor(Math.random() * 300) + 10);
    setArray(arr);
  }

  function visualize(steps) {
    setRunning(true);
    let i = 0;
    function step() {
      if (i >= steps.length) {
        setRunning(false);
        return;
      }
      const { array: arrSnapshot, highlights } = steps[i];
      setArray([...arrSnapshot]);
      i++;
      timeoutRef.current = setTimeout(step, Math.max(10, speed));
    }
    step();
  }

  function handleStart() {
    if (running) return;
    let steps = [];
    const arrCopy = [...array];
    if (algo === 'bubble') steps = bubbleSort(arrCopy);
    if (algo === 'merge') steps = mergeSort(arrCopy);
    if (algo === 'quick') steps = quickSort(arrCopy);
    visualize(steps);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">Sorting Visualizer</h2>
          <p className="text-sm text-gray-500">Bubble · Merge · Quick — animated and responsive</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={algo} onChange={(e) => setAlgo(e.target.value)}
            className="px-3 py-1 rounded-lg border">
            <option value="bubble">Bubble Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-sm">Size</label>
            <input type="range" min="10" max="120" value={size}
              onChange={(e) => { setSize(Number(e.target.value)); generateArray(Number(e.target.value)); }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Speed</label>
            <input type="range" min="5" max="300" value={speed}
              onChange={(e)=> setSpeed(Number(e.target.value))} />
          </div>
          <button onClick={() => generateArray(size)} className="px-3 py-1 bg-brand-500 text-white rounded-lg">Randomize</button>
          <button onClick={handleStart} className="px-3 py-1 bg-green-500 text-white rounded-lg" disabled={running}>Start</button>
          <button onClick={() => { clearTimeout(timeoutRef.current); setRunning(false); generateArray(size); }} className="px-3 py-1 bg-gray-200 rounded-lg">Reset</button>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full h-64 flex items-end gap-1 px-2">
          {array.map((val, i) => {
            const height = Math.max(4, Math.round((val / 350) * 100));
            return (
              <div key={i} className="bar bg-brand-400 rounded" style={{ width: `${100/array.length}%`, height: `${height}%` }} title={val}></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
