const fn = (x, y) => (x - 2) ** 2 + (y - 1) ** 2;

const DIRECTIONS = [
  { d: [1, 0], label: '+x' },
  { d: [-1, 0], label: '−x' },
  { d: [0, 1], label: '+y' },
  { d: [0, -1], label: '−y' },
];

function* coordinateSearchGenerator({ start, stepSize, maxIter }) {
  let x = [...start];
  let step = stepSize;
  const path = [x.slice()];

  yield {
    current: x.slice(),
    path: path.slice(),
    step,
    trying: null,
    type: 'start',
    description: `Start at (${x[0]}, ${x[1]}). f = ${fn(x[0], x[1]).toFixed(3)}. Step size: ${step}.`,
  };

  for (let iter = 0; iter < maxIter; iter++) {
    const currentVal = fn(x[0], x[1]);
    let bestVal = currentVal;
    let bestPoint = null;

    for (const { d, label } of DIRECTIONS) {
      const candidate = [x[0] + step * d[0], x[1] + step * d[1]];
      const val = fn(candidate[0], candidate[1]);

      yield {
        current: x.slice(),
        path: path.slice(),
        step,
        trying: candidate,
        tryingLabel: label,
        type: 'try',
        description: `Iteration ${iter + 1}: testing direction ${label} → (${candidate[0].toFixed(3)}, ${candidate[1].toFixed(3)}). f = ${val.toFixed(3)} (current: ${currentVal.toFixed(3)}).`,
      };

      if (val < bestVal) {
        bestVal = val;
        bestPoint = candidate;
      }
    }

    if (bestPoint) {
      x = bestPoint;
      path.push(x.slice());

      yield {
        current: x.slice(),
        path: path.slice(),
        step,
        trying: null,
        type: 'move',
        description: `Moved to (${x[0].toFixed(3)}, ${x[1].toFixed(3)}). f = ${bestVal.toFixed(3)}. Improvement: ${(currentVal - bestVal).toFixed(3)}.`,
      };
    } else {
      step = step / 2;

      yield {
        current: x.slice(),
        path: path.slice(),
        step,
        trying: null,
        type: 'reduce',
        description: `No improvement in any direction. Halving step size → ${step.toFixed(6)}.`,
      };

      if (step < 1e-6) {
        yield {
          current: x.slice(),
          path: path.slice(),
          step,
          trying: null,
          type: 'done',
          description: `Converged at (${x[0].toFixed(5)}, ${x[1].toFixed(5)}). f = ${fn(x[0], x[1]).toFixed(7)}.`,
        };
        return;
      }
    }
  }

  yield {
    current: x.slice(),
    path: path.slice(),
    step,
    trying: null,
    type: 'done',
    description: `Max iterations reached. Final: (${x[0].toFixed(5)}, ${x[1].toFixed(5)}). f = ${fn(x[0], x[1]).toFixed(7)}.`,
  };
}

export function generateCSSteps(input) {
  const steps = [];
  for (const step of coordinateSearchGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_CS_INPUT = {
  start: [-4, -4],
  stepSize: 1.0,
  maxIter: 20,
};

export function randomizeCSInput() {
  return {
    start: [
      parseFloat((Math.random() * 8 - 4).toFixed(1)),
      parseFloat((Math.random() * 8 - 4).toFixed(1)),
    ],
    stepSize: 1.0,
    maxIter: 20,
  };
}
