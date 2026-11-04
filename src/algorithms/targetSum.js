function* targetSumGenerator({ array, target }) {
  let left = 0, right = array.length - 1;

  yield {
    array: [...array],
    left, right, found: null,
    description: `Find pair summing to ${target} in sorted [${array.join(', ')}].`,
  };

  while (left < right) {
    const sum = array[left] + array[right];

    yield {
      array: [...array],
      left, right, found: null,
      description: `arr[${left}]=${array[left]} + arr[${right}]=${array[right]} = ${sum} ${sum === target ? '= ' : sum < target ? '< ' : '> '}${target}.`,
    };

    if (sum === target) {
      yield {
        array: [...array],
        left, right, found: left,
        description: `Found! arr[${left}] + arr[${right}] = ${array[left]} + ${array[right]} = ${target}.`,
      };
      return;
    } else if (sum < target) {
      yield {
        array: [...array],
        left: left + 1, right, found: null,
        description: `Sum too small → move left pointer right. left = ${left + 1}.`,
      };
      left++;
    } else {
      yield {
        array: [...array],
        left, right: right - 1, found: null,
        description: `Sum too large → move right pointer left. right = ${right - 1}.`,
      };
      right--;
    }
  }

  yield {
    array: [...array],
    left, right, found: -1,
    description: `Pointers crossed — no pair sums to ${target}.`,
  };
}

export function generateTargetSumSteps(input) {
  const steps = [];
  for (const step of targetSumGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_TARGET_SUM_INPUT = {
  array: [1, 3, 5, 7, 11, 14, 18, 22],
  target: 25,
};

export function randomizeTargetSumInput() {
  const n = 8;
  const set = new Set();
  while (set.size < n) set.add(Math.floor(Math.random() * 30) + 1);
  const arr = [...set].sort((a, b) => a - b);
  const pickPair = Math.random() < 0.7;
  let target;
  if (pickPair) {
    const i = Math.floor(Math.random() * (n - 1));
    const j = i + 1 + Math.floor(Math.random() * (n - 1 - i));
    target = arr[i] + arr[j];
  } else {
    target = arr[0] + arr[n - 1] + Math.floor(Math.random() * 5) + 1;
  }
  return { array: arr, target };
}