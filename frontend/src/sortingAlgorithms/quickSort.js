/*
 Quick Sort - records array snapshots on swaps for visualization.
*/

export function quickSort(arr) {
  const a = [...arr];
  const steps = [];
  function snapshot() { steps.push({ array: [...a], highlights: [] }); }
  snapshot();

  function partition(l, r) {
    const pivot = a[r];
    let i = l - 1;
    for (let j = l; j < r; j++) {
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({ array: [...a], highlights: [i, j] });
      }
    }
    [a[i+1], a[r]] = [a[r], a[i+1]];
    steps.push({ array: [...a], highlights: [i+1, r] });
    return i + 1;
  }

  function quick(l, r) {
    if (l < r) {
      const pi = partition(l, r);
      quick(l, pi - 1);
      quick(pi + 1, r);
    }
  }

  quick(0, a.length - 1);
  snapshot();
  return steps;
}
