function mergePairs(arr, l, mid, r) {
  const left = arr.slice(l, mid + 1);
  const right = arr.slice(mid + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}

function* mergeSortGenerator({ array }) {
  const arr = [...array];
  const n = arr.length;
  const sorted = new Set();

  yield {
    array: [...arr],
    mergeL: null, mergeR: null, mergeMid: null,
    sorted: new Set(),
    description: `Original array: [${arr.join(', ')}]. Bottom-up merge sort.`,
  };

  for (let width = 1; width < n; width *= 2) {
    yield {
      array: [...arr],
      mergeL: null, mergeR: null, mergeMid: null,
      sorted: new Set(sorted),
      description: `Pass: merge subarrays of width ${width} into ${width * 2}.`,
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
        description: `Merging [${l}..${mid}] and [${mid + 1}..${r}]: [${arr.slice(l, mid + 1).join(',')}] + [${arr.slice(mid + 1, r + 1).join(',')}].`,
      };

      mergePairs(arr, l, mid, r);

      for (let k = l; k <= r; k++) sorted.add(k);

      yield {
        array: [...arr],
        mergeL: l, mergeR: r, mergeMid: mid,
        sorted: new Set(sorted),
        description: `After merge [${l}..${r}]: [${arr.slice(l, r + 1).join(', ')}].`,
      };
    }
  }

  yield {
    array: [...arr],
    mergeL: null, mergeR: null, mergeMid: null,
    sorted: new Set(Array.from({ length: n }, (_, i) => i)),
    description: `Done. Sorted: [${arr.join(', ')}].`,
  };
}

export function generateMergeSortSteps(input) {
  const steps = [];
  for (const step of mergeSortGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_MERGE_SORT_INPUT = {
  array: [38, 27, 43, 3, 9, 82, 10],
};

export function randomizeMergeSortInput() {
  const n = 6 + Math.floor(Math.random() * 3);
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 1);
  return { array: arr };
}