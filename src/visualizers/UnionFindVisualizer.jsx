import styles from './UnionFindVisualizer.module.css';
import ColorLegend from '../components/ColorLegend/ColorLegend.jsx';

const SVG_W = 580;
const SVG_H = 270;
const NODE_Y = 200;
const R = 20;
const PADDING = 50;

export const UF_LEGEND = [
  { color: '#9ca3af', label: 'Node (non-root)' },
  { color: '#22c55e', label: 'Root of a component' },
  { color: '#f97316', label: 'Node on active path' },
  { color: '#3b82f6', label: 'Root of active path' },
];

function nodePositions(nodes) {
  const positions = {};
  const step = nodes.length > 1 ? (SVG_W - 2 * PADDING) / (nodes.length - 1) : 0;
  nodes.forEach((id, i) => {
    positions[id] = { x: PADDING + i * step, y: NODE_Y };
  });
  return positions;
}

export default function UnionFindVisualizer({ input, stepState }) {
  const nodes = input?.nodes || [0, 1, 2, 3, 4, 5, 6, 7];
  const ops   = input?.operations || [];

  const parent = stepState?.parent || Object.fromEntries(nodes.map((id) => [id, id]));
  const rank   = stepState?.rank   || Object.fromEntries(nodes.map((id) => [id, 0]));
  const highlighting = stepState?.highlighting || [];

  const pos = nodePositions(nodes);

  function getNodeFill(id) {
    const isHighlighted = highlighting.includes(id);
    const isRoot = parent[id] === id;
    if (isHighlighted && isRoot) return '#3b82f6';
    if (isHighlighted)           return '#f97316';
    if (isRoot)                  return '#22c55e';
    return '#9ca3af';
  }

  // Format the operations list for display
  const opsText = ops.map((op) =>
    op.type === 'union' ? `union(${op.a},${op.b})` : `find(${op.a})`
  ).join('  ·  ');

  return (
    <div className={styles.wrapper}>
      <div className={styles.opsLabel}>{opsText}</div>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className={styles.svg}
        aria-label="Union-Find visualization"
      >
        <defs>
          <marker id="uf-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" />
          </marker>
          <marker id="uf-arr-hi" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
          </marker>
          <marker id="uf-arr-blue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Parent pointer arrows */}
        {nodes.map((id) => {
          const p = parent[id];
          if (p === id) return null; // root: no arrow

          const { x: cx, y: cy } = pos[id];
          const { x: px, y: py } = pos[p];

          const startX = cx;
          const startY = cy - R;
          const endX = px;
          const endY = py - R;
          const ctrlX = (startX + endX) / 2;
          const ctrlY = Math.max(18, (cy - R) - 24 - 0.32 * Math.abs(cx - px));

          const isHi = highlighting.includes(id);
          const parentIsRoot = parent[p] === p;
          const markerId = isHi
            ? (parentIsRoot ? 'uf-arr-blue' : 'uf-arr-hi')
            : 'uf-arr';
          const strokeColor = isHi
            ? (parentIsRoot ? '#3b82f6' : '#f97316')
            : '#94a3b8';

          return (
            <path
              key={id}
              d={`M${startX},${startY} Q${ctrlX},${ctrlY} ${endX},${endY}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isHi ? 2.5 : 1.5}
              markerEnd={`url(#${markerId})`}
              style={{ transition: 'stroke 0.25s' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((id) => {
          const { x, y } = pos[id];
          const fill = getNodeFill(id);
          const isRoot = parent[id] === id;

          return (
            <g key={id}>
              {/* Dashed ring on roots */}
              {isRoot && (
                <circle
                  cx={x} cy={y} r={R + 6}
                  fill="none"
                  stroke={fill}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.7"
                />
              )}
              <circle
                cx={x} cy={y} r={R}
                fill={fill}
                stroke="white"
                strokeWidth="2.5"
                style={{ transition: 'fill 0.25s' }}
              />
              <text
                x={x} y={y + 5}
                textAnchor="middle"
                fontSize="13" fontWeight="700" fill="white"
              >
                {id}
              </text>
              {/* Rank label below node */}
              <text
                x={x} y={y + R + 15}
                textAnchor="middle"
                fontSize="10" fill="#64748b"
              >
                r={rank[id]}
              </text>
            </g>
          );
        })}
      </svg>

      <ColorLegend items={UF_LEGEND} />
    </div>
  );
}