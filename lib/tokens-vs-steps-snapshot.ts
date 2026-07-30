/**
 * Per-trial output-tokens vs steps snapshot for the announcement page.
 *
 * Sourced from Terminal-Bench 3.0 (frontier-bench) PR #1421:
 *   docs/charts/tokens_vs_steps.html
 *   commit d6f4615914ba48ad7ecfd8d0d5eb2067f689f236
 *
 * Point tuple: [steps, outputTokens, outcome] where outcome is
 * `p` (pass), `f` (fail), or `e` (error).
 */

import raw from '@/lib/tokens-vs-steps-snapshot.json';

export type TrialOutcome = 'p' | 'f' | 'e';

export type TokensVsStepsPoint = readonly [
  steps: number,
  outputTokens: number,
  outcome: TrialOutcome,
];

export type TokensVsStepsPanel = {
  id: string;
  name: string;
  acc: number;
  n: number;
  n_all: number;
  pts: readonly TokensVsStepsPoint[];
};

export type TokensVsStepsSnapshot = {
  source: string;
  xMax: number;
  yMax: number;
  panels: readonly TokensVsStepsPanel[];
};

export const TOKENS_VS_STEPS_SNAPSHOT =
  raw as unknown as TokensVsStepsSnapshot;
