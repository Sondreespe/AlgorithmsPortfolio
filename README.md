# Algorithm Visualizer

An interactive study tool for **INF234 – Algorithm Design**, built to deepen understanding of classic algorithms through step-by-step animation, pseudocode, and complexity analysis.

Based on Kleinberg & Tardos, *Algorithm Design*.

## Features

- Step-by-step visualization with Play / Pause / Next / Prev / Reset controls
- Color-coded state per step (current node, tentative match, rejected, etc.)
- Info panel per algorithm: time/space complexity, explanation, pseudocode
- Randomize input to explore different executions
- Registry-based architecture — adding a new algorithm is one entry + one visualizer component

## Tech stack

- React + Vite
- React Router
- CSS Modules
- SVG visualizations

## Getting started

```bash
npm install
npm run dev
```

## Algorithms

| Algorithm | Category | Time | Space |
|-----------|----------|------|-------|
| Gale-Shapley (Stable Matching) | Greedy | O(n²) | O(n²) |

## Project structure

```
src/
  algorithms/       # Step generators (pure logic, no React)
    gsMatching.js
    registry.js     # Central config — id, name, complexity, pseudocode, component
  visualizers/      # SVG components per algorithm type
  components/       # Shared UI (AlgorithmCard, StepControls, InfoPanel, ...)
  pages/            # Landing, Overview, AlgorithmDetail
  hooks/
    useAlgorithmPlayer.js
```
