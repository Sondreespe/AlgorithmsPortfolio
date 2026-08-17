import styles from './Pseudocode.module.css';

const KEYWORDS = [
  'if', 'else', 'while', 'for', 'return', 'and', 'or', 'not',
  'in', 'of', 'do', 'end', 'then', 'each', 'is', 'let',
];

function highlightLine(line) {
  const tokens = line.split(/(\s+|[(),←→:+\-*/=<>≤≥∞|.]+)/);
  return tokens.map((token, i) => {
    const lower = token.trim().toLowerCase();
    if (KEYWORDS.includes(lower)) {
      return (
        <span key={i} className={styles.keyword}>
          {token}
        </span>
      );
    }
    // Numbers
    if (/^\d+$/.test(token.trim())) {
      return (
        <span key={i} className={styles.number}>
          {token}
        </span>
      );
    }
    // Comments (lines starting with //)
    if (token.trim().startsWith('//')) {
      return (
        <span key={i} className={styles.comment}>
          {token}
        </span>
      );
    }
    return <span key={i}>{token}</span>;
  });
}

export default function Pseudocode({ code }) {
  if (!code) return null;

  const lines = code.split('\n');

  return (
    <div className={styles.block}>
      <div className={styles.header}>Pseudocode</div>
      <pre className={styles.pre}>
        {lines.map((line, i) => {
          const isComment = line.trim().startsWith('//');
          const indent = line.match(/^(\s*)/)[0].length;
          return (
            <div
              key={i}
              className={`${styles.line} ${isComment ? styles.commentLine : ''}`}
              style={{ paddingLeft: `${indent * 0}px` }}
            >
              {highlightLine(line)}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
