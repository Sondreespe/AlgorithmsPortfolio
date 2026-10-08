import styles from './ClosestPairVisualizer.module.css';
import ColorLegend from '../components/ColorLegend/ColorLegend.jsx';

const SVG_W = 460;
const SVG_H = 460;
const ML = 40;
const MR = 20;
const MT = 20;
const MB = 40;
const PLOT_W = SVG_W - ML - MR;
const PLOT_H = SVG_H - MT - MB;
const DATA_MIN = 0;
const DATA_MAX = 9;
const RANGE = DATA_MAX - DATA_MIN;
const R = 13;

function toSVG(x, y) {
  return {
    x: ML + ((x - DATA_MIN) / RANGE) * PLOT_W,
    y: SVG_H - MB - ((y - DATA_MIN) / RANGE) * PLOT_H,
  };
}

export const CP_LEGEND = [
  { color: '#94a3b8', label: 'Point' },
  { color: '#3b82f6', label: 'Left partition' },
  { color: '#a855f7', label: 'Right partition' },
  { color: '#f59e0b', label: 'In strip' },
  { color: '#f97316', label: 'Comparing' },
  { color: '#22c55e', label: 'Best pair' },
];

function pointColor(idx, comparing, stripSet, leftSet, rightSet) {
  if (comparing && comparing.includes(idx)) return '#f97316';
  if (stripSet.includes(idx)) return '#f59e0b';
  if (leftSet.includes(idx)) return '#3b82f6';
  if (rightSet.includes(idx)) return '#a855f7';
  return '#94a3b8';
}

export default function ClosestPairVisualizer({ input, stepState }) {
  const points = input?.points || [];

  const leftSet   = stepState?.leftSet   || [];
  const rightSet  = stepState?.rightSet  || [];
  const stripSet  = stepState?.stripSet  || [];
  const comparing = stepState?.comparing || null;
  const divideX   = stepState?.divideX   ?? null;
  const stripWidth = stepState?.stripWidth ?? null;
  const bestPair  = stepState?.bestPair  || null;

  const xTicks = [1, 2, 3, 4, 5, 6, 7, 8];
  const yTicks = [1, 2, 3, 4, 5, 6, 7, 8];

  const divSVG   = divideX != null ? toSVG(divideX, 0).x : null;
  const stripL   = (divideX != null && stripWidth != null)
    ? toSVG(divideX - stripWidth, 0).x : null;
  const stripR   = (divideX != null && stripWidth != null)
    ? toSVG(divideX + stripWidth, 0).x : null;

  return (
    <div className={styles.wrapper}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className={styles.svg} aria-label="Closest Pair visualization">
        {/* Grid lines */}
        {xTicks.map(v => {
          const sx = toSVG(v, 0).x;
          return <line key={`gx${v}`} x1={sx} y1={MT} x2={sx} y2={SVG_H - MB} stroke="#f1f5f9" strokeWidth="1" />;
        })}
        {yTicks.map(v => {
          const sy = toSVG(0, v).y;
          return <line key={`gy${v}`} x1={ML} y1={sy} x2={SVG_W - MR} y2={sy} stroke="#f1f5f9" strokeWidth="1" />;
        })}

        {/* Axes */}
        <line x1={ML} y1={MT} x2={ML} y2={SVG_H - MB} stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1={ML} y1={SVG_H - MB} x2={SVG_W - MR} y2={SVG_H - MB} stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Axis ticks */}
        {xTicks.map(v => {
          const sx = toSVG(v, 0).x;
          return (
            <text key={`xt${v}`} x={sx} y={SVG_H - MB + 16} textAnchor="middle" fontSize="10" fill="#94a3b8">{v}</text>
          );
        })}
        {yTicks.map(v => {
          const sy = toSVG(0, v).y;
          return (
            <text key={`yt${v}`} x={ML - 8} y={sy + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
          );
        })}

        {/* Strip band */}
        {stripL != null && stripR != null && (
          <rect
            x={stripL} y={MT}
            width={stripR - stripL}
            height={PLOT_H}
            fill="#fef3c7"
            opacity="0.55"
          />
        )}

        {/* Divide line */}
        {divSVG != null && (
          <line
            x1={divSVG} y1={MT}
            x2={divSVG} y2={SVG_H - MB}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
        )}

        {/* Best pair line */}
        {bestPair && (() => {
          const p1 = toSVG(points[bestPair[0]].x, points[bestPair[0]].y);
          const p2 = toSVG(points[bestPair[1]].x, points[bestPair[1]].y);
          return (
            <line
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#22c55e" strokeWidth="2.5" strokeDasharray="5 3"
              opacity="0.8"
            />
          );
        })()}

        {/* Comparing pair line */}
        {comparing && (() => {
          const p1 = toSVG(points[comparing[0]].x, points[comparing[0]].y);
          const p2 = toSVG(points[comparing[1]].x, points[comparing[1]].y);
          return (
            <line
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#f97316" strokeWidth="2"
              opacity="0.7"
            />
          );
        })()}

        {/* Points */}
        {points.map((pt, idx) => {
          const { x, y } = toSVG(pt.x, pt.y);
          const fill = pointColor(idx, comparing, stripSet, leftSet, rightSet);
          const isBest = bestPair && bestPair.includes(idx);
          return (
            <g key={idx}>
              {isBest && (
                <circle cx={x} cy={y} r={R + 5} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
              )}
              <circle
                cx={x} cy={y} r={R}
                fill={fill}
                stroke="white"
                strokeWidth="2.5"
                style={{ transition: 'fill 0.25s' }}
              />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
                {pt.label}
              </text>
            </g>
          );
        })}
      </svg>

      <ColorLegend items={CP_LEGEND} />
    </div>
  );
}