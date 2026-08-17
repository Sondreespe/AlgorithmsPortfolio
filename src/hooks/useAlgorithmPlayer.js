import { useState, useCallback, useRef, useEffect } from 'react';

export function useAlgorithmPlayer(steps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stepsRef = useRef(steps);

  // Update ref when steps change
  useEffect(() => {
    stepsRef.current = steps;
    setStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  const totalSteps = steps ? steps.length : 0;
  const currentStep = steps && steps.length > 0 ? steps[stepIndex] : null;

  const onNext = useCallback(() => {
    setStepIndex((prev) => {
      const next = prev + 1;
      if (next >= stepsRef.current.length) {
        setIsPlaying(false);
        return prev;
      }
      return next;
    });
  }, []);

  const onPrev = useCallback(() => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const onReset = useCallback(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    stepIndex,
    totalSteps,
    currentStep,
    isPlaying,
    onNext,
    onPrev,
    onReset,
    onPlay,
    onPause,
  };
}
