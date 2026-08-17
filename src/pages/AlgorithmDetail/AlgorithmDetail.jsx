import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import styles from './AlgorithmDetail.module.css';

import { ALGORITHMS, DEFAULT_GS_INPUT, randomizeGSInput } from '../../algorithms/registry.js';
import { useAlgorithmPlayer } from '../../hooks/useAlgorithmPlayer.js';
import BipartiteVisualizer from '../../visualizers/BipartiteVisualizer.jsx';
import StepControls from '../../components/StepControls/StepControls.jsx';
import InfoPanel from '../../components/InfoPanel/InfoPanel.jsx';

export default function AlgorithmDetail() {
  const { id } = useParams();
  const algorithm = ALGORITHMS.find((a) => a.id === id);
  if (!algorithm) return <Navigate to="/algorithms" replace />;
  return <AlgorithmDetailInner key={id} algorithm={algorithm} />;
}

function AlgorithmDetailInner({ algorithm }) {
  const navigate = useNavigate();
  const [input, setInput] = useState(() => algorithm.defaultInput);

  const steps = useMemo(() => algorithm.generateSteps(input), [algorithm, input]);
  const player = useAlgorithmPlayer(steps);
  const { stepIndex, totalSteps, currentStep, isPlaying, onNext, onPrev, onReset, onPlay, onPause } = player;

  const handleRandomize = useCallback(() => {
    setInput(randomizeGSInput(input.proposers.length));
  }, [input.proposers.length]);

  const { proposers, acceptors, proposerPrefs, acceptorPrefs } = input;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/algorithms')}>
          &larr; Back
        </button>
        <div className={styles.headerMeta}>
          <span className={`${styles.catBadge} ${styles.catGreedy}`}>
            {algorithm.category}
          </span>
          <h1 className={styles.title}>{algorithm.name}</h1>
        </div>
      </div>

      <div className={styles.layout}>
        <main className={styles.main}>
          <div className={styles.inputBar}>
            <button className={styles.randomizeBtn} onClick={handleRandomize}>
              Randomize
            </button>
          </div>

          <div className={styles.visualizerBox}>
            <BipartiteVisualizer input={input} stepState={currentStep} />
          </div>

          <div className={styles.stepDescription}>
            {currentStep?.description || 'Press Play or Next to start.'}
          </div>

          <StepControls
            onPrev={onPrev}
            onNext={onNext}
            onPlay={onPlay}
            onPause={onPause}
            onReset={onReset}
            isPlaying={isPlaying}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
          />

          <div className={styles.prefSection}>
            <h3 className={styles.prefTitle}>Preference Lists</h3>
            <div className={styles.prefTables}>
              <PreferenceTable
                label="Proposers"
                members={proposers}
                others={acceptors}
                prefs={proposerPrefs}
                currentStep={currentStep}
                side="proposer"
              />
              <PreferenceTable
                label="Acceptors"
                members={acceptors}
                others={proposers}
                prefs={acceptorPrefs}
                currentStep={currentStep}
                side="acceptor"
              />
            </div>
          </div>
        </main>

        <aside className={styles.sidebar}>
          <InfoPanel algorithm={algorithm} />
        </aside>
      </div>
    </div>
  );
}

function PreferenceTable({ label, members, others, prefs, currentStep, side }) {
  const matchP = currentStep?.matchP || {};
  const matchA = currentStep?.matchA || {};

  return (
    <div className={styles.prefTable}>
      <h4 className={styles.prefTableTitle}>{label}</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            {others.map((o) => (
              <th key={o} className={styles.th}>{o}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const partner = side === 'proposer' ? matchP[m] : matchA[m];
            return (
              <tr key={m}>
                <td className={styles.tdName}>{m}</td>
                {prefs[m].map((o) => (
                  <td
                    key={o}
                    className={`${styles.td} ${o === partner ? styles.tdMatched : ''}`}
                  >
                    {prefs[m].indexOf(o) + 1}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
