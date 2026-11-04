import styles from './GraphVisualizer.module.css';
import ColorLegend from '../components/ColorLegend/ColorLegend.jsx';

export const BFS_LEGEND = [
  { color: '#9ca3af', label: 'Unvisited' },
  { color: '#fbbf24', label: 'In queue / examining' },
  { color: '#3b82f6', label: 'Current' },
  { color: '#22c55e', label: 'Visited' },
];

export const DFS_LEGEND = [
  { color: '#9ca3af', label: 'Unvisited' },
  { color: '#fbbf24', label: 'In stack / examining' },
  { color: '#3b82f6', label: 'Current' },
  { color: '#22c55e', label: 'Visited' },
];

function getNodeColor(nodeId, stepState) {
  if (!stepState) return '#9ca3af';
  const { visited, queue, current, examining } = stepState;
  if (current === nodeId) return '#3b82f6';
  if (examining === nodeId) return '#fbbf24';
  if (visited?.has(nodeId)) return '#22c55e';
  if (queue?.includes(nodeId)) return '#fbbf24';
  return '#9ca3af';
}

export default function GraphVisualizer({ nodes, edges, positions, stepState, legend, directed }) {
  return (
    <div className={styles.wrapper}>
      <svg
        viewBox="0 0 560 340"
        className={styles.svg}
        aria-label="Graph visualization"
      >
        {directed && (
          <defs>
            <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#d1d5db" />
            </marker>
          </defs>
        )}
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          if (directed) {
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return null;
            const ex = to.x - (dx / dist) * 24;
            const ey = to.y - (dy / dist) * 24;
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={ex} y2={ey}
                stroke="#d1d5db"
                strokeWidth="2"
                markerEnd="url(#arrowGray)"
              />
            );
          }
          return (
            <line
              key={i}
              x1={from.x} y1={from.y}
              x2={to.x}   y2={to.y}
              stroke="#d1d5db"
              strokeWidth="2"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const color = getNodeColor(node.id, stepState);
          return (
            <g key={node.id}>
              <circle
                cx={pos.x} cy={pos.y} r={22}
                fill={color}
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
            </g>
          );
        })}
      </svg>

      <ColorLegend items={legend || BFS_LEGEND} />
    </div>
  );
}
