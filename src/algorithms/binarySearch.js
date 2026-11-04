function* bsGenerator({ array, target }) {
  let lo = 0, hi = array.length - 1;

  yield {
    array: [...array],
    lo, hi, mid: null, found: null,
    description: `Search for ${target} in [${array.join(', ')}]. lo=${lo}, hi=${hi}.`,
  };

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    yield {
      array: [...array],
      lo, hi, mid, found: null,
      description: `mid = ⌊(${lo}+${hi})/2⌋ = ${mid}. arr[${mid}] = ${array[mid]}.`,
    };

    if (array[mid] === target) {
      yield {
        array: [...array],
        lo, hi, mid, found: mid,
        description: `arr[${mid}] = ${array[mid]} = target ${target}. Found at index ${mid}!`,
      };
      return;
    } else if (array[mid] < target) {
      yield {
        array: [...array],
        lo: mid + 1, hi, mid, found: null,
        description: `arr[${mid}] = ${array[mid]} < ${target} → search right half. lo = ${mid + 1}.`,
      };
      lo = mid + 1;
    } else {
      yield {
        array: [...array],
        lo, hi: mid - 1, mid, found: null,
        description: `arr[${mid}] = ${array[mid]} > ${target} → search left half. hi = ${mid - 1}.`,
      };
      hi = mid - 1;
    }
  }

  yield {
    array: [...array],
    lo, hi, mid: null, found: -1,
    description: `lo > hi — ${target} not found.`,
  };
}

export function generateBinarySearchSteps(input) {
  const steps = [];
  for (const step of bsGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_BS_INPUT = {
  array: [2, 5, 8, 12, 16, 23, 38, 45, 72, 91],
  target: 23,
};

export function randomizeBSInput() {
  const n = 10;
  const arr = Array.from(new Set(Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 1)))
    .sort((a, b) => a - b)
    .slice(0, n);
  while (arr.length < n) arr.push(arr[arr.length - 1] + Math.floor(Math.random() * 5) + 1);
  arr.sort((a, b) => a - b);
  const pickExisting = Math.random() < 0.7;
  const target = pickExisting
    ? arr[Math.floor(Math.random() * arr.length)]
    : arr[Math.floor(Math.random() * arr.length)] + 3;
  return { array: arr, target };
}