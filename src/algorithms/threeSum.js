function* threeSumGenerator({ array }) {
  const arr = [...array].sort((a, b) => a - b);
  const n = arr.length;
  const triples = [];

  yield {
    array: [...arr],
    fixedIdx: null, left: null, right: null, found: null,
    description: `Sorted array: [${arr.join(', ')}]. Find all triples summing to 0.`,
  };

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) continue;

    let left = i + 1, right = n - 1;

    yield {
      array: [...arr],
      fixedIdx: i, left, right, found: null,
      description: `Fix arr[${i}]=${arr[i]}. Two-pointer on [${i + 1}..${n - 1}].`,
    };

    while (left < right) {
      const sum = arr[i] + arr[left] + arr[right];

      yield {
        array: [...arr],
        fixedIdx: i, left, right, found: null,
        description: `${arr[i]} + arr[${left}]=${arr[left]} + arr[${right}]=${arr[right]} = ${sum}.`,
      };

      if (sum === 0) {
        triples.push([arr[i], arr[left], arr[right]]);
        yield {
          array: [...arr],
          fixedIdx: i, left, right, found: left,
          description: `Triple found: (${arr[i]}, ${arr[left]}, ${arr[right]}). Triples so far: ${triples.map((t) => `(${t.join(',')})`).join(' ')}.`,
        };
        while (left < right && arr[left] === arr[left + 1]) left++;
        while (left < right && arr[right] === arr[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) {
        left++;
        yield {
          array: [...arr],
          fixedIdx: i, left, right, found: null,
          description: `Sum ${sum} < 0 → move left right. left = ${left}.`,
        };
      } else {
        right--;
        yield {
          array: [...arr],
          fixedIdx: i, left, right, found: null,
          description: `Sum ${sum} > 0 → move right left. right = ${right}.`,
        };
      }
    }
  }

  yield {
    array: [...arr],
    fixedIdx: null, left: null, right: null, found: null,
    description: triples.length > 0
      ? `Done. Found ${triples.length} triple${triples.length > 1 ? 's' : ''}: ${triples.map((t) => `(${t.join(',')})`).join(', ')}.`
      : 'Done. No zero-sum triple found.',
  };
}

export function generateThreeSumSteps(input) {
  const steps = [];
  for (const step of threeSumGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_THREE_SUM_INPUT = {
  array: [-4, -1, -1, 0, 1, 2],
};

export function randomizeThreeSumInput() {
  const n = 6 + Math.floor(Math.random() * 2);
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 14) - 7);
  if (Math.random() < 0.6) {
    const i = Math.floor(Math.random() * n);
    const j = Math.floor(Math.random() * n);
    arr[i] = -(arr[j] + arr[(j + 1) % n]);
  }
  return { array: arr };
}