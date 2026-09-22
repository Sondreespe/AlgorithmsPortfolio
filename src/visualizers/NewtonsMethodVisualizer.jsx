import styles from './NewtonsMethodVisualizer.module.css';
import ColorLegend from '../components/ColorLegend/ColorLegend.jsx';

const SVG_W = 480;
const SVG_H = 480;
const ML = 45;
const MR = 15;
const MT = 20;
const MB = 40;
const PLOT_W = SVG_W - ML - MR;
const PLOT_H = SVG_H - MT - MB;
const X_MIN = -5;
const X_MAX = 7;
const Y_MIN = -5;
const Y_MAX = 7;
const SCALE = PLOT_W / (X_MAX - X_MIN);

const MIN_X = 2;
const MIN_Y = 1;

// f(x,y) = (x-2)² + 5(y-1)² — ellipse semi-axes: √c in x, √(c/5) in y
const CONTOUR_LEVELS = [1, 4, 9, 16, 25, 36];
const TICK_INTERVAL = 2;

// Learning rate used for the comparison GD arrow
const COMPARE_LR = 0.1;

function toSVG(x, y) {
  return {
    x: ML + (x - X_MIN) * SCALE,
    y: MT + PLOT_H - (y - Y_MIN) * SCALE,
  };
}

function clampToPlot(pt) {
  return {
    x: Math.max(ML, Math.min(ML + PLOT_W, pt.x)),
    y: Math.max(MT, Math.min(MT + PLOT_H, pt.y)),
  };
}

function ArrowMarker({ id, color }) {
  return (
    <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill={color} />
    </marker>
  );
}

export const NM_LEGEND = [
  { color: '#94a3b8', label: 'Contour lines' },
  { color: '#93c5fd', label: 'Visited path' },
  { color: '#3b82f6', label: 'Current position' },
  { color: '#f97316', label: 'GD step −α∇f  (α = 0.1, for comparison)' },
  { color: '#06b6d4', label: 'Newton direction d = −H⁻¹∇f' },
  { color: '#22c55e', label: 'Minimum (2, 1)' },
];

export default function NewtonsMethodVisualizer({ input, stepState }) {
  const start = input?.start || [-3, 3];
  const path = stepState?.path || [start];
  const current = stepState?.current || path[path.length - 1];
  const gradient = stepState?.gradient;
  const direction = stepState?.direction;
  const newPoint = stepState?.newPoint;
  const stepType = stepState?.type;

  const minSVG = toSVG(MIN_X, MIN_Y);
  const currentSVG = toSVG(current[0], current[1]);

  const xTicks = [];
  for (let v = Math.ceil(X_MIN); v <= X_MAX; v += TICK_INTERVAL) xTicks.push(v);
  const yTicks = [];
  for (let v = Math.ceil(Y_MIN); v <= Y_MAX; v += TICK_INTERVAL) yTicks.push(v);

  const showArrows = stepType === 'compute' && gradient && direction && newPoint;

  // GD comparison arrow: current → current - COMPARE_LR * ∇f
  const gdArrowFrom = showArrows ? toSVG(current[0], current[1]) : null;
  const gdArrowTo = showArrows
    ? clampToPlot(toSVG(
        current[0] - COMPARE_LR * gradient[0],
        current[1] - COMPARE_LR * gradient[1],
      ))
    : null;

  // Newton arrow: current → newPoint
  const newtonArrowFrom = showArrows ? toSVG(current[0], current[1]) : null;
  const newtonArrowTo = showArrows ? clampToPlot(toSVG(newPoint[0], newPoint[1])) : null;

  const newtonDotInBounds = showArrows && (() => {
    const s = toSVG(newPoint[0], newPoint[1]);
    return s.x >= ML && s.x <= ML + PLOT_W && s.y >= MT && s.y <= MT + PLOT_H;
  })();

  return (
    <div className={styles.wrapper}>
      <div className={styles.fnLabel}>f(x, y) = (x − 2)² + 5(y − 1)²  ·  H = [[2, 0], [0, 10]]</div>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className={styles.svg}
        aria-label="Newton's method contour visualization"
      >
        <defs>
          <ArrowMarker id="arrow-gd" color="#f97316" />
          <ArrowMarker id="arrow-newton" color="#06b6d4" />
          <clipPath id="nm-plot-clip">
            <rect x={ML} y={MT} width={PLOT_W} height={PLOT_H} />
          </clipPath>
        </defs>

        {/* Plot background */}
        <rect x={ML} y={MT} width={PLOT_W} height={PLOT_H} fill="#f8fafc" />

        {/* Grid lines */}
        {xTicks.map((v) => {
          const sx = toSVG(v, 0).x;
          return <line key={`gx-${v}`} x1={sx} y1={MT} x2={sx} y2={MT + PLOT_H} stroke="#e2e8f0" strokeWidth="1" />;
        })}
        {yTicks.map((v) => {
          const sy = toSVG(0, v).y;
          return <line key={`gy-${v}`} x1={ML} y1={sy} x2={ML + PLOT_W} y2={sy} stroke="#e2e8f0" strokeWidth="1" />;
        })}

        {/* Elliptical contour lines */}
        {CONTOUR_LEVELS.map((c) => {
          const rx = Math.sqrt(c) * SCALE;
          const ry = Math.sqrt(c / 5) * SCALE;
          return (
            <g key={c} clipPath="url(#nm-plot-clip)">
              <ellipse
                cx={minSVG.x}
                cy={minSVG.y}
                rx={rx}
                ry={ry}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <text x={minSVG.x + rx + 3} y={minSVG.y + 4} fontSize="9" fill="#94a3b8">
                {c}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={ML} y1={MT + PLOT_H} x2={ML + PLOT_W} y2={MT + PLOT_H} stroke="#94a3b8" strokeWidth="1.5" />
        <line x1={ML} y1={MT} x2={ML} y2={MT + PLOT_H} stroke="#94a3b8" strokeWidth="1.5" />

        {/* Axis ticks and labels */}
        {xTicks.map((v) => {
          const sx = toSVG(v, 0).x;
          return (
            <g key={`xt-${v}`}>
              <line x1={sx} y1={MT + PLOT_H} x2={sx} y2={MT + PLOT_H + 5} stroke="#94a3b8" strokeWidth="1.5" />
              <text x={sx} y={MT + PLOT_H + 16} textAnchor="middle" fontSize="11" fill="#94a3b8">{v}</text>
            </g>
          );
        })}
        {yTicks.map((v) => {
          const sy = toSVG(0, v).y;
          return (
            <g key={`yt-${v}`}>
              <line x1={ML - 5} y1={sy} x2={ML} y2={sy} stroke="#94a3b8" strokeWidth="1.5" />
              <text x={ML - 8} y={sy + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{v}</text>
            </g>
          );
        })}

        {/* Origin dashed cross */}
        {(() => {
          const ox = toSVG(0, 0);
          return (
            <>
              <line x1={ox.x} y1={MT} x2={ox.x} y2={MT + PLOT_H} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
              <line x1={ML} y1={ox.y} x2={ML + PLOT_W} y2={ox.y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            </>
          );
        })()}

        {/* Path line */}
        {path.length > 1 && (
          <polyline
            points={path.map(([px, py]) => {
              const s = toSVG(px, py);
              return `${s.x},${s.y}`;
            }).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinejoin="round"
            clipPath="url(#nm-plot-clip)"
          />
        )}

        {/* Past path dots */}
        {path.slice(0, -1).map(([px, py], i) => {
          const s = toSVG(px, py);
          return (
            <circle key={i} cx={s.x} cy={s.y} r={4} fill="#93c5fd" stroke="white" strokeWidth="1.5" clipPath="url(#nm-plot-clip)" />
          );
        })}

        {/* GD comparison arrow (dashed orange): shows what gradient descent would do */}
        {showArrows && (
          <g clipPath="url(#nm-plot-clip)">
            <line
              x1={gdArrowFrom.x}
              y1={gdArrowFrom.y}
              x2={gdArrowTo.x}
              y2={gdArrowTo.y}
              stroke="#f97316"
              strokeWidth="2"
              strokeDasharray="6 3"
              markerEnd="url(#arrow-gd)"
            />
          </g>
        )}

        {/* Newton direction arrow (solid teal) */}
        {showArrows && (
          <g clipPath="url(#nm-plot-clip)">
            <line
              x1={newtonArrowFrom.x}
              y1={newtonArrowFrom.y}
              x2={newtonArrowTo.x}
              y2={newtonArrowTo.y}
              stroke="#06b6d4"
              strokeWidth="2.5"
              markerEnd="url(#arrow-newton)"
            />
          </g>
        )}

        {/* Newton's next position dot */}
        {showArrows && newtonDotInBounds && (() => {
          const ns = toSVG(newPoint[0], newPoint[1]);
          return <circle cx={ns.x} cy={ns.y} r={5} fill="#06b6d4" opacity={0.85} stroke="white" strokeWidth="1.5" />;
        })()}

        {/* Current position */}
        <circle
          cx={currentSVG.x}
          cy={currentSVG.y}
          r={7}
          fill={stepType === 'done' ? '#22c55e' : '#3b82f6'}
          stroke="white"
          strokeWidth="2.5"
          style={{ transition: 'cx 0.2s, cy 0.2s' }}
        />

        {/* Global minimum marker */}
        <circle cx={minSVG.x} cy={minSVG.y} r={5} fill="#22c55e" stroke="white" strokeWidth="2" />
        <text x={minSVG.x + 8} y={minSVG.y - 6} fontSize="10" fill="#15803d" fontWeight="600">
          (2, 1)
        </text>
      </svg>

      <ColorLegend items={NM_LEGEND} />
    </div>
  );
}
