/*
 Bubble Sort - produces steps for visualization.
 Each step is an object { array: [...], highlights: [i,j] } so the UI can show progress.
*/
export function bubbleSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  steps.push({ array: [...a], highlights: [] });
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // record comparison
      steps.push({ array: [...a], highlights: [j, j+1] });
      if (a[j] > a[j+1]) {
        [a[j], a[j+1]] = [a[j+1], a[j]];
        steps.push({ array: [...a], highlights: [j, j+1] });
      }
    }
  }
  steps.push({ array: [...a], highlights: [] });
  return steps;
}
