function* mergeGenerator({ arrayA, arrayB }) {
  let pA = 0, pB = 0;
  const result = [];

  yield {
    array: [...arrayA],
    arrayB: [...arrayB],
    pA, pB,
    result: [],
    description: `Merge A=[${arrayA.join(',')}] and B=[${arrayB.join(',')}]. Start with both pointers at 0.`,
  };

  while (pA < arrayA.length && pB < arrayB.length) {
    yield {
      array: [...arrayA],
      arrayB: [...arrayB],
      pA, pB,
      result: [...result],
      description: `Compare A[${pA}]=${arrayA[pA]} and B[${pB}]=${arrayB[pB]}.`,
    };

    if (arrayA[pA] <= arrayB[pB]) {
      result.push(arrayA[pA]);
      yield {
        array: [...arrayA],
        arrayB: [...arrayB],
        pA: pA + 1, pB,
        result: [...result],
        description: `A[${pA}]=${arrayA[pA]} ≤ B[${pB}]=${arrayB[pB]} → take from A. Result: [${result.join(',')}].`,
      };
      pA++;
    } else {
      result.push(arrayB[pB]);
      yield {
        array: [...arrayA],
        arrayB: [...arrayB],
        pA, pB: pB + 1,
        result: [...result],
        description: `B[${pB}]=${arrayB[pB]} < A[${pA}]=${arrayA[pA]} → take from B. Result: [${result.join(',')}].`,
      };
      pB++;
    }
  }

  while (pA < arrayA.length) {
    result.push(arrayA[pA]);
    yield {
      array: [...arrayA],
      arrayB: [...arrayB],
      pA: pA + 1, pB: arrayB.length,
      result: [...result],
      description: `B exhausted — append A[${pA}]=${arrayA[pA]}.`,
    };
    pA++;
  }
  while (pB < arrayB.length) {
    result.push(arrayB[pB]);
    yield {
      array: [...arrayA],
      arrayB: [...arrayB],
      pA: arrayA.length, pB: pB + 1,
      result: [...result],
      description: `A exhausted — append B[${pB}]=${arrayB[pB]}.`,
    };
    pB++;
  }

  yield {
    array: [...arrayA],
    arrayB: [...arrayB],
    pA: arrayA.length, pB: arrayB.length,
    result: [...result],
    description: `Done. Merged result: [${result.join(', ')}].`,
  };
}

export function generateMergeListsSteps(input) {
  const steps = [];
  for (const step of mergeGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_MERGE_LISTS_INPUT = {
  arrayA: [1, 4, 7, 10, 13],
  arrayB: [2, 5, 8, 11],
};

export function randomizeMergeListsInput() {
  const nA = 4 + Math.floor(Math.random() * 3);
  const nB = 3 + Math.floor(Math.random() * 3);
  const setA = new Set();
  while (setA.size < nA) setA.add(Math.floor(Math.random() * 25) + 1);
  const setB = new Set();
  while (setB.size < nB) setB.add(Math.floor(Math.random() * 25) + 1);
  return {
    arrayA: [...setA].sort((a, b) => a - b),
    arrayB: [...setB].sort((a, b) => a - b),
  };
}