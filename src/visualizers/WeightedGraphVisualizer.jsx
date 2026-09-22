import styles from './WeightedGraphVisualizer.module.css';
import ColorLegend from '../components/ColorLegend/ColorLegend.jsx';

function edgeKey(a, b) {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

function getEdgeStroke(from, to, stepState) {
  const key = edgeKey(from, to);
  if (stepState?.examineEdge === key) return { color: '#f97316', width: 3, dash: '6 3' };
  if (stepState?.mstEdges?.has(key) || stepState?.treeEdges?.has(key)) return { color: '#22c55e', width: 3, dash: 'none' };
  if (stepState?.rejectedEdges?.has(key)) return { color: '#ef4444', width: 2, dash: '5 4' };
  return { color: '#d1d5db', width: 2, dash: 'none' };
}

function getNodeFill(nodeId, stepState) {
  if (stepState?.current === nodeId) return '#3b82f6';
  if (stepState?.examining === nodeId) return '#fbbf24';
  if (stepState?.visited?.has(nodeId) || stepState?.inMST?.has(nodeId)) return '#22c55e';
  if (stepState?.frontier?.has(nodeId)) return '#fbbf24';
  return '#9ca3af';
}

export const DIJKSTRA_LEGEND = [
  { color: '#9ca3af', label: 'Unvisited' },
  { color: '#fbbf24', label: 'In frontier / examining' },
  { color: '#3b82f6', label: 'Current (extracting)' },
  { color: '#22c55e', label: 'Finalized' },
  { color: '#f97316', label: 'Edge being examined' },
  { color: '#22c55e', label: 'Shortest-path tree edge' },
];

export const KRUSKAL_LEGEND = [
  { color: '#9ca3af', label: 'Node' },
  { color: '#3b82f6', label: 'From-node of examined edge' },
  { color: '#fbbf24', label: 'To-node of examined edge' },
  { color: '#f97316', label: 'Edge being considered' },
  { color: '#22c55e', label: 'MST edge (accepted)' },
  { color: '#ef4444', label: 'Rejected (creates cycle)' },
];

export const PRIM_LEGEND = [
  { color: '#9ca3af', label: 'Not yet in MST' },
  { color: '#fbbf24', label: 'Reachable frontier / examining' },
  { color: '#3b82f6', label: 'Current MST node' },
  { color: '#22c55e', label: 'In MST' },
  { color: '#f97316', label: 'Edge being examined' },
  { color: '#22c55e', label: 'MST edge (accepted)' },
];

export default function WeightedGraphVisualizer({ nodes, edges, positions, stepState, legend }) {
  const dist = stepState?.dist;
  const fmtDist = (id) => {
    if (!dist) return null;
    const d = dist[id];
    return d === Infinity ? '∞' : String(d);
  };

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox="0 0 590 340"
        className={styles.svg}
        aria-label="Weighted graph visualization"
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const stroke = getEdgeStroke(edge.from, edge.to, stepState);
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;

          // Offset label perpendicular to edge to avoid overlap with line
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const ox = (-dy / len) * 10;
          const oy = (dx / len) * 10;

          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeDasharray={stroke.dash === 'none' ? undefined : stroke.dash}
                style={{ transition: 'stroke 0.25s' }}
              />
              {/* Weight label with white background */}
              <rect
                x={mx + ox - 10}
                y={my + oy - 9}
                width={20}
                height={16}
                rx={3}
                fill="white"
                opacity={0.9}
              />
              <text
                x={mx + ox}
                y={my + oy + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={stroke.color === '#d1d5db' ? '#6b7280' : stroke.color}
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const fill = getNodeFill(node.id, stepState);
          const distLabel = fmtDist(node.id);

          return (
            <g key={node.id}>
              <circle
                cx={pos.x} cy={pos.y} r={22}
                fill={fill}
                stroke="white" strokeWidth="2.5"
                style={{ transition: 'fill 0.25s' }}
              />
              <text
                x={pos.x} y={pos.y + 5}
                textAnchor="middle"
                fontSize="14" fontWeight="700" fill="white"
              >
                {node.label}
              </text>
              {/* Distance label for Dijkstra */}
              {distLabel !== null && (
                <>
                  <rect
                    x={pos.x - 16}
                    y={pos.y + 25}
                    width={32}
                    height={16}
                    rx={4}
                    fill="#1e293b"
                    opacity={0.85}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 37}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="white"
                  >
                    {distLabel}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <ColorLegend items={legend} />
    </div>
  );
}