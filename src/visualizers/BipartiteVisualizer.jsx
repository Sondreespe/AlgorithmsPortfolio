import styles from './BipartiteVisualizer.module.css';
import ColorLegend from '../components/ColorLegend/ColorLegend.jsx';

const R = 22;
const SVG_W = 600;
const SVG_H = 360;
const LEFT_X = 110;
const RIGHT_X = 490;

function nodeY(index, total) {
  if (total === 1) return SVG_H / 2;
  return 60 + (index * (SVG_H - 120)) / (total - 1);
}

function edgeEndpoint(x1, y1, x2, y2, radius) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: x2, y: y2 };
  return { x: x2 - (dx / len) * radius, y: y2 - (dy / len) * radius };
}

function getProposerColor(p, stepState) {
  if (!stepState) return '#9ca3af';
  const { matchP, proposing, rejected, done } = stepState;
  if (proposing?.from === p) return '#3b82f6';
  if (rejected?.proposer === p) return '#ef4444';
  if (done && matchP[p]) return '#22c55e';
  if (matchP[p]) return '#fbbf24';
  return '#9ca3af';
}

function getAcceptorColor(w, stepState) {
  if (!stepState) return '#9ca3af';
  const { matchA, proposing, done } = stepState;
  if (proposing?.to === w) return '#3b82f6';
  if (done && matchA[w]) return '#22c55e';
  if (matchA[w]) return '#fbbf24';
  return '#9ca3af';
}

export const GS_LEGEND = [
  { color: '#9ca3af', label: 'Free' },
  { color: '#3b82f6', label: 'Proposing / Receiving' },
  { color: '#fbbf24', label: 'Tentative match' },
  { color: '#22c55e', label: 'Stable match' },
  { color: '#ef4444', label: 'Just rejected' },
];

export default function BipartiteVisualizer({ input, stepState }) {
  const { proposers, acceptors } = input;
  const n = proposers.length;

  const pPos = Object.fromEntries(
    proposers.map((p, i) => [p, { x: LEFT_X, y: nodeY(i, n) }])
  );
  const aPos = Object.fromEntries(
    acceptors.map((a, i) => [a, { x: RIGHT_X, y: nodeY(i, n) }])
  );

  const matches = stepState?.matchP || {};
  const isProposing = stepState?.proposing;
  const isDone = stepState?.done;

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className={styles.svg}
        aria-label="Bipartite matching visualization"
      >
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
          <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
          </marker>
        </defs>

        {/* Column labels */}
        <text x={LEFT_X} y={28} textAnchor="middle" fontSize="13" fontWeight="600" fill="#6b7280">
          Proposers
        </text>
        <text x={RIGHT_X} y={28} textAnchor="middle" fontSize="13" fontWeight="600" fill="#6b7280">
          Acceptors
        </text>

        {/* Match edges */}
        {Object.entries(matches).map(([p, w]) => {
          const p1 = pPos[p];
          const p2 = aPos[w];
          if (!p1 || !p2) return null;
          const end = edgeEndpoint(p1.x, p1.y, p2.x, p2.y, R + 4);
          const start = edgeEndpoint(p2.x, p2.y, p1.x, p1.y, R + 4);
          const color = isDone ? '#22c55e' : '#fbbf24';
          const markerId = isDone ? 'url(#arrow-green)' : 'none';
          return (
            <line
              key={`match-${p}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={color}
              strokeWidth={isDone ? 2.5 : 2}
              strokeDasharray={isDone ? 'none' : '6 3'}
              markerEnd={markerId}
            />
          );
        })}

        {/* Proposal arrow */}
        {isProposing && (() => {
          const p1 = pPos[isProposing.from];
          const p2 = aPos[isProposing.to];
          if (!p1 || !p2) return null;
          const end = edgeEndpoint(p1.x, p1.y, p2.x, p2.y, R + 4);
          const start = edgeEndpoint(p2.x, p2.y, p1.x, p1.y, R + 4);
          return (
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="8 4"
              markerEnd="url(#arrow)"
            />
          );
        })()}

        {/* Proposer nodes */}
        {proposers.map((p) => {
          const pos = pPos[p];
          const color = getProposerColor(p, stepState);
          return (
            <g key={p} style={{ transition: 'fill 0.25s' }}>
              <circle cx={pos.x} cy={pos.y} r={R} fill={color} stroke="white" strokeWidth="2.5" />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="white"
              >
                {p}
              </text>
            </g>
          );
        })}

        {/* Acceptor nodes */}
        {acceptors.map((w) => {
          const pos = aPos[w];
          const color = getAcceptorColor(w, stepState);
          return (
            <g key={w} style={{ transition: 'fill 0.25s' }}>
              <circle cx={pos.x} cy={pos.y} r={R} fill={color} stroke="white" strokeWidth="2.5" />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="white"
              >
                {w}
              </text>
            </g>
          );
        })}
      </svg>

      <ColorLegend items={GS_LEGEND} />
    </div>
  );
}
