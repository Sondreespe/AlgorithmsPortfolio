// f(x,y) = (x-2)² + 5(y-1)² — same elliptical bowl as gradient descent
const fn = (x, y) => (x - 2) ** 2 + 5 * (y - 1) ** 2;
const gradFx = (x) => 2 * (x - 2);
const gradFy = (y) => 10 * (y - 1);

// Hessian: H = [[2, 0], [0, 10]]  →  H⁻¹ = [[0.5, 0], [0, 0.1]]
// Newton direction: d = −H⁻¹∇f = [−gx/2, −gy/10]

function* newtonsMethodGenerator({ start, stepSize, maxIter }) {
  let x = [...start];
  const path = [x.slice()];
  const EPSILON = 1e-6;

  yield {
    current: x.slice(),
    path: path.slice(),
    gradient: null,
    direction: null,
    newPoint: null,
    stepSize,
    type: 'start',
    description: `Start at (${x[0].toFixed(3)}, ${x[1].toFixed(3)}). f = ${fn(x[0], x[1]).toFixed(3)}. Hessian H = [[2, 0], [0, 10]] (constant for this quadratic).`,
  };

  for (let iter = 0; iter < maxIter; iter++) {
    const gx = gradFx(x[0]);
    const gy = gradFy(x[1]);
    const gradMag = Math.sqrt(gx ** 2 + gy ** 2);

    if (gradMag < EPSILON) {
      yield {
        current: x.slice(),
        path: path.slice(),
        gradient: [gx, gy],
        direction: null,
        newPoint: null,
        stepSize,
        type: 'done',
        description: `Converged! |∇f| = ${gradMag.toExponential(2)} < ε. Minimum at (${x[0].toFixed(5)}, ${x[1].toFixed(5)}), f = ${fn(x[0], x[1]).toExponential(4)}.`,
      };
      return;
    }

    // Newton direction: d = −H⁻¹∇f
    const dx = -gx / 2;   // H⁻¹_xx · gx = 0.5 · gx
    const dy = -gy / 10;  // H⁻¹_yy · gy = 0.1 · gy
    const newPoint = [x[0] + stepSize * dx, x[1] + stepSize * dy];

    yield {
      current: x.slice(),
      path: path.slice(),
      gradient: [gx, gy],
      direction: [dx, dy],
      newPoint: newPoint.slice(),
      stepSize,
      type: 'compute',
      description: `Iter ${iter + 1}: ∇f = (${gx.toFixed(3)}, ${gy.toFixed(3)}), |∇f| = ${gradMag.toFixed(4)}. Newton dir d = −H⁻¹∇f = (${dx.toFixed(3)}, ${dy.toFixed(3)}). Orange arrow = GD step (α=0.1). Teal arrow = Newton step → (${newPoint[0].toFixed(3)}, ${newPoint[1].toFixed(3)}).`,
    };

    const fOld = fn(x[0], x[1]);
    x = newPoint;
    path.push(x.slice());
    const fNew = fn(x[0], x[1]);

    yield {
      current: x.slice(),
      path: path.slice(),
      gradient: null,
      direction: null,
      newPoint: null,
      stepSize,
      type: 'move',
      description: `Iter ${iter + 1}: x ← (${x[0].toFixed(4)}, ${x[1].toFixed(4)}). f: ${fOld.toFixed(5)} → ${fNew.toExponential(4)}.`,
    };
  }

  yield {
    current: x.slice(),
    path: path.slice(),
    gradient: null,
    direction: null,
    newPoint: null,
    stepSize,
    type: 'done',
    description: `Max iterations reached. Final: (${x[0].toFixed(5)}, ${x[1].toFixed(5)}), f = ${fn(x[0], x[1]).toExponential(4)}.`,
  };
}

export function generateNMSteps(input) {
  const steps = [];
  for (const step of newtonsMethodGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_NM_INPUT = {
  start: [-3, 3],
  stepSize: 1.0,
  maxIter: 10,
};

export function randomizeNMInput() {
  return {
    start: [
      parseFloat((Math.random() * 8 - 4).toFixed(1)),
      parseFloat((Math.random() * 8 - 4).toFixed(1)),
    ],
    stepSize: 1.0,
    maxIter: 10,
  };
}
