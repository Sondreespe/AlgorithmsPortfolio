// f(x,y) = (x-2)² + 5(y-1)² — elliptical bowl, minimum at (2,1)
const fn = (x, y) => (x - 2) ** 2 + 5 * (y - 1) ** 2;
const gradFx = (x, _y) => 2 * (x - 2);
const gradFy = (_x, y) => 10 * (y - 1);

function* gradientDescentGenerator({ start, learningRate, maxIter }) {
  let x = [...start];
  const path = [x.slice()];
  const EPSILON = 1e-6;

  yield {
    current: x.slice(),
    path: path.slice(),
    gradient: null,
    newPoint: null,
    learningRate,
    type: 'start',
    description: `Start at (${x[0].toFixed(3)}, ${x[1].toFixed(3)}). f = ${fn(x[0], x[1]).toFixed(3)}. Learning rate α = ${learningRate}.`,
  };

  for (let iter = 0; iter < maxIter; iter++) {
    const gx = gradFx(x[0], x[1]);
    const gy = gradFy(x[0], x[1]);
    const gradMag = Math.sqrt(gx ** 2 + gy ** 2);
    const xNew = [x[0] - learningRate * gx, x[1] - learningRate * gy];

    yield {
      current: x.slice(),
      path: path.slice(),
      gradient: [gx, gy],
      newPoint: xNew.slice(),
      learningRate,
      type: 'gradient',
      description: `Iter ${iter + 1}: ∇f(${x[0].toFixed(3)}, ${x[1].toFixed(3)}) = (${gx.toFixed(3)}, ${gy.toFixed(3)}), |∇f| = ${gradMag.toFixed(4)}. Stepping in direction −∇f.`,
    };

    if (gradMag < EPSILON) {
      yield {
        current: x.slice(),
        path: path.slice(),
        gradient: [gx, gy],
        newPoint: null,
        learningRate,
        type: 'done',
        description: `Converged! |∇f| = ${gradMag.toExponential(2)} < ε. Minimum at (${x[0].toFixed(5)}, ${x[1].toFixed(5)}), f = ${fn(x[0], x[1]).toFixed(8)}.`,
      };
      return;
    }

    const fOld = fn(x[0], x[1]);
    const fNew = fn(xNew[0], xNew[1]);
    x = xNew;
    path.push(x.slice());

    yield {
      current: x.slice(),
      path: path.slice(),
      gradient: [gx, gy],
      newPoint: null,
      learningRate,
      type: 'move',
      description: `Iter ${iter + 1}: x ← (${x[0].toFixed(4)}, ${x[1].toFixed(4)}). f: ${fOld.toFixed(5)} → ${fNew.toFixed(5)}  (Δ = ${(fOld - fNew).toFixed(5)}).`,
    };
  }

  yield {
    current: x.slice(),
    path: path.slice(),
    gradient: null,
    newPoint: null,
    learningRate,
    type: 'done',
    description: `Max iterations reached. Final: (${x[0].toFixed(5)}, ${x[1].toFixed(5)}), f = ${fn(x[0], x[1]).toFixed(7)}.`,
  };
}

export function generateGDSteps(input) {
  const steps = [];
  for (const step of gradientDescentGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_GD_INPUT = {
  start: [-3, 3],
  learningRate: 0.1,
  maxIter: 30,
};

export function randomizeGDInput() {
  const lr = parseFloat((Math.random() * 0.12 + 0.04).toFixed(3));
  return {
    start: [
      parseFloat((Math.random() * 8 - 4).toFixed(1)),
      parseFloat((Math.random() * 8 - 4).toFixed(1)),
    ],
    learningRate: lr,
    maxIter: 30,
  };
}
