function mergeCount(arr, l, mid, r) {
  const left = arr.slice(l, mid + 1);
  const right = arr.slice(mid + 1, r + 1);
  let i = 0, j = 0, k = l;
  let inv = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      inv += left.length - i;
      arr[k++] = right[j++];
    }
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
  return inv;
}

function* countInversionsGenerator({ array }) {
  const arr = [...array];
  const n = arr.length;
  const sorted = new Set();
  let totalInversions = 0;

  yield {
    array: [...arr],
    mergeL: null, mergeR: null, mergeMid: null,
    sorted: new Set(),
    inversions: totalInversions,
    description: `Array: [${arr.join(', ')}]. Count split inversions during bottom-up merge sort.`,
  };

  for (let width = 1; width < n; width *= 2) {
    yield {
      array: [...arr],
      mergeL: null, mergeR: null, mergeMid: null,
      sorted: new Set(sorted),
      inversions: totalInversions,
      description: `Pass: merge subarrays of width ${width} and count inversions.`,
    };

    for (let l = 0; l < n; l += 2 * width) {
      const mid = Math.min(l + width - 1, n - 1);
      const r = Math.min(l + 2 * width - 1, n - 1);

      if (mid >= r) {
        for (let k = l; k <= r; k++) sorted.add(k);
        continue;
      }

      yield {
        array: [...arr],
        mergeL: l, mergeR: r, mergeMid: mid,
        sorted: new Set(sorted),
        inversions: totalInversions,
        description: `Merging [${l}..${mid}]=[${arr.slice(l, mid + 1).join(',')}] and [${mid + 1}..${r}]=[${arr.slice(mid + 1, r + 1).join(',')}].`,
      };

      const splitInv = mergeCount(arr, l, mid, r);
      totalInversions += splitInv;

      for (let k = l; k <= r; k++) sorted.add(k);

      yield {
        array: [...arr],
        mergeL: l, mergeR: r, mergeMid: mid,
        sorted: new Set(sorted),
        inversions: totalInversions,
        description: `Merged [${l}..${r}]: [${arr.slice(l, r + 1).join(',')}]. +${splitInv} split inversions → total: ${totalInversions}.`,
      };
    }
  }

  yield {
    array: [...arr],
    mergeL: null, mergeR: null, mergeMid: null,
    sorted: new Set(Array.from({ length: n }, (_, i) => i)),
    inversions: totalInversions,
    description: `Done. Sorted: [${arr.join(', ')}]. Total inversions: ${totalInversions}.`,
  };
}

export function generateCountInversionsSteps(input) {
  const steps = [];
  for (const step of countInversionsGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_COUNT_INVERSIONS_INPUT = {
  array: [5, 2, 4, 1, 3],
};

export function randomizeCountInversionsInput() {
  const n = 5 + Math.floor(Math.random() * 2);
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 10) + 1);
  return { array: arr };
}