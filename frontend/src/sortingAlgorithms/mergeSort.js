/*
 Merge Sort - collects steps by performing merge operations and recording snapshots.
*/

function merge(left, right) {
  const result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) result.push(left.shift());
    else result.push(right.shift());
  }
  return result.concat(left).concat(right);
}

export function mergeSort(arr) {
  const steps = [];
  // bottom-up iterative to capture steps more easily
  function snapshot(a) {
    steps.push({ array: [...a], highlights: [] });
  }
  let width = 1;
  let a = [...arr];
  snapshot(a);
  while (width < a.length) {
    let i = 0;
    while (i < a.length) {
      const left = a.slice(i, i + width);
      const right = a.slice(i + width, i + 2 * width);
      const merged = merge([...left], [...right]);
      for (let k = 0; k < merged.length; k++) {
        a[i + k] = merged[k];
      }
      snapshot(a);
      i += 2 * width;
    }
    width *= 2;
  }
  snapshot(a);
  return steps;
}
