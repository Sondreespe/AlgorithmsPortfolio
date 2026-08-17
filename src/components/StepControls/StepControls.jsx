import { useEffect, useRef } from 'react';
import styles from './StepControls.module.css';

export default function StepControls({
  onPrev,
  onNext,
  onPlay,
  onPause,
  onReset,
  isPlaying,
  stepIndex,
  totalSteps,
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onNext();
      }, 800);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, onNext]);

  const atStart = stepIndex === 0;
  const atEnd = stepIndex >= totalSteps - 1;

  return (
    <div className={styles.controls}>
      <div className={styles.buttons}>
        <button
          className={styles.btn}
          onClick={onReset}
          title="Reset"
          aria-label="Reset to beginning"
        >
          &#9198;
        </button>
        <button
          className={styles.btn}
          onClick={onPrev}
          disabled={atStart}
          title="Previous step"
          aria-label="Previous step"
        >
          &#9194;
        </button>
        {isPlaying ? (
          <button
            className={`${styles.btn} ${styles.playBtn}`}
            onClick={onPause}
            title="Pause"
            aria-label="Pause"
          >
            &#9646;&#9646;
          </button>
        ) : (
          <button
            className={`${styles.btn} ${styles.playBtn}`}
            onClick={onPlay}
            disabled={atEnd}
            title="Play"
            aria-label="Play"
          >
            &#9654;
          </button>
        )}
        <button
          className={styles.btn}
          onClick={onNext}
          disabled={atEnd}
          title="Next step"
          aria-label="Next step"
        >
          &#9193;
        </button>
      </div>
      <div className={styles.progress}>
        Step <strong>{stepIndex + 1}</strong> of <strong>{totalSteps}</strong>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
