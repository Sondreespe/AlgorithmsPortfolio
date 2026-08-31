import styles from './ContourVisualizer.module.css';
import ColorLegend from '../components/ColorLegend/ColorLegend.jsx';

const SVG_W = 480;
const SVG_H = 480;
const ML = 45; // margin left (y-axis labels)
const MR = 15;
const MT = 20;
const MB = 40; // margin bottom (x-axis labels)
const PLOT_W = SVG_W - ML - MR; // 420
const PLOT_H = SVG_H - MT - MB; // 420
const X_MIN = -5;
const X_MAX = 7;
const Y_MIN = -5;
const Y_MAX = 7;
const SCALE = PLOT_W / (X_MAX - X_MIN); // 35 (square, same for x and y)

function toSVG(x, y) {
  return {
    x: ML + (x - X_MIN) * SCALE,
    y: MT + PLOT_H - (y - Y_MIN) * SCALE,
  };
}

const CONTOUR_LEVELS = [1, 4, 9, 16, 25];
const TICK_INTERVAL = 2;
const MIN_X = 2;
const MIN_Y = 1;

export const CS_LEGEND = [
  { color: '#94a3b8', label: 'Contour lines' },
  { color: '#93c5fd', label: 'Visited path' },
  { color: '#3b82f6', label: 'Current position' },
  { color: '#f97316', label: 'Candidate (testing)' },
  { color: '#22c55e', label: 'Global minimum' },
];

export default function ContourVisualizer({ input, stepState }) {
  const start = input?.start || [-4, -4];
  const path = stepState?.path || [start];
  const current = stepState?.current || path[path.length - 1];
  const trying = stepState?.trying;
  const step = stepState?.step;
  const stepType = stepState?.type;

  const minSVG = toSVG(MIN_X, MIN_Y);
  const currentSVG = toSVG(current[0], current[1]);

  // Axis ticks
  const xTicks = [];
  for (let v = Math.ceil(X_MIN); v <= X_MAX; v += TICK_INTERVAL) xTicks.push(v);
  const yTicks = [];
  for (let v = Math.ceil(Y_MIN); v <= Y_MAX; v += TICK_INTERVAL) yTicks.push(v);

  return (
    <div className={styles.wrapper}>
      <div className={styles.fnLabel}>f(x, y) = (x − 2)² + (y − 1)²</div>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className={styles.svg}
        aria-label="Coordinate search contour visualization"
      >
        {/* Plot background */}
        <rect x={ML} y={MT} width={PLOT_W} height={PLOT_H} fill="#f8fafc" />

        {/* Grid lines */}
        {xTicks.map((v) => {
          const sx = toSVG(v, 0).x;
          return (
            <line key={`gx-${v}`} x1={sx} y1={MT} x2={sx} y2={MT + PLOT_H}
              stroke="#e2e8f0" strokeWidth="1" />
          );
        })}
        {yTicks.map((v) => {
          const sy = toSVG(0, v).y;
          return (
            <line key={`gy-${v}`} x1={ML} y1={sy} x2={ML + PLOT_W} y2={sy}
              stroke="#e2e8f0" strokeWidth="1" />
          );
        })}

        {/* Contour circles */}
        {CONTOUR_LEVELS.map((c) => {
          const r = Math.sqrt(c) * SCALE;
          return (
            <g key={c}>
              <circle cx={minSVG.x} cy={minSVG.y} r={r}
                fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
              <text
                x={minSVG.x + r + 3}
                y={minSVG.y + 4}
                fontSize="9"
                fill="#94a3b8"
              >
                {c}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        {/* x-axis */}
        <line x1={ML} y1={MT + PLOT_H} x2={ML + PLOT_W} y2={MT + PLOT_H}
          stroke="#94a3b8" strokeWidth="1.5" />
        {/* y-axis */}
        <line x1={ML} y1={MT} x2={ML} y2={MT + PLOT_H}
          stroke="#94a3b8" strokeWidth="1.5" />

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

        {/* Origin lines */}
        {(() => {
          const ox = toSVG(0, 0);
          return (
            <>
              <line x1={ox.x} y1={MT} x2={ox.x} y2={MT + PLOT_H}
                stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
              <line x1={ML} y1={ox.y} x2={ML + PLOT_W} y2={ox.y}
                stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
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
          />
        )}

        {/* Past path dots */}
        {path.slice(0, -1).map(([px, py], i) => {
          const s = toSVG(px, py);
          return <circle key={i} cx={s.x} cy={s.y} r={4} fill="#93c5fd" stroke="white" strokeWidth="1.5" />;
        })}

        {/* Candidate being tested */}
        {trying && (() => {
          const from = toSVG(current[0], current[1]);
          const to = toSVG(trying[0], trying[1]);
          return (
            <>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
              <circle cx={to.x} cy={to.y} r={5} fill="#f97316" opacity={0.8} />
            </>
          );
        })()}

        {/* Current position */}
        <circle cx={currentSVG.x} cy={currentSVG.y} r={7}
          fill={stepType === 'move' ? '#22c55e' : '#3b82f6'}
          stroke="white" strokeWidth="2.5"
          style={{ transition: 'cx 0.2s, cy 0.2s' }}
        />

        {/* Global minimum marker */}
        <circle cx={minSVG.x} cy={minSVG.y} r={5}
          fill="#22c55e" stroke="white" strokeWidth="2" />
        <text x={minSVG.x + 8} y={minSVG.y - 6} fontSize="10" fill="#15803d" fontWeight="600">
          (2, 1)
        </text>

        {/* Step size display */}
        {step != null && (
          <text x={ML + PLOT_W - 4} y={MT + 14} textAnchor="end" fontSize="11" fill="#64748b">
            step = {step.toFixed(step < 0.01 ? 6 : 4)}
          </text>
        )}
      </svg>

      <ColorLegend items={CS_LEGEND} />
    </div>
  );
}
