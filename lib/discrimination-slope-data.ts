import { ANNOUNCEMENT_LEADERBOARD_SNAPSHOT } from '@/lib/announcement-leaderboard-snapshot';
import { TERMINAL_BENCH_2_1_LEADERBOARD_SNAPSHOT } from '@/lib/terminal-bench-2-1-leaderboard-snapshot';

export type DiscriminationSlopePoint = {
  model: string;
  agent: string;
  /** Terminal-Bench 3.0 pass rate (%). */
  tb3Accuracy: number;
  tb3ReasoningEffort: string | null;
  /** Terminal-Bench 2.1 pass rate (%), if the same agent+model was run. */
  terminalAccuracy: number | null;
  terminalReasoningEffort: string | null;
  /** True when agent+model(+reasoning when possible) exists on both boards. */
  linked: boolean;
};

type Matchable = {
  model: string;
  agent: string;
  reasoningEffort: string | null;
  accuracy: number;
  status: 'display' | 'hide';
};

function agentModelKey(entry: Pick<Matchable, 'agent' | 'model'>): string {
  return `${entry.agent}||${entry.model}`;
}

/**
 * Pick the Terminal-Bench 2.1 row that best matches a Terminal-Bench 3.0 row:
 * 1. same agent + model + reasoning effort
 * 2. else same agent + model, preferring `display`, then higher accuracy
 */
function findTerminalMatch(tb3: Matchable): Matchable | null {
  const candidates = TERMINAL_BENCH_2_1_LEADERBOARD_SNAPSHOT.filter(
    (row) => row.agent === tb3.agent && row.model === tb3.model,
  );
  if (candidates.length === 0) return null;

  const exact = candidates.find(
    (row) =>
      row.reasoningEffort != null &&
      row.reasoningEffort === tb3.reasoningEffort,
  );
  if (exact) return exact;

  return [...candidates].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'display' ? -1 : 1;
    return b.accuracy - a.accuracy;
  })[0]!;
}

/**
 * Slope-chart rows: Terminal-Bench 3.0 *display* entries that also have a matching
 * Terminal-Bench 2.1 agent+model run (reasoning matched when possible).
 * Unmatched right-side-only points are omitted.
 */
export function buildDiscriminationSlopeData(): DiscriminationSlopePoint[] {
  const points: DiscriminationSlopePoint[] = [];
  const seen = new Set<string>();

  for (const tb3 of ANNOUNCEMENT_LEADERBOARD_SNAPSHOT) {
    if (tb3.status !== 'display') continue;
    if (tb3.model === 'GPT-5.6 Sol') continue;
    const key = agentModelKey(tb3);
    if (seen.has(key)) continue;
    seen.add(key);

    const terminal = findTerminalMatch(tb3);
    if (terminal == null) continue;

    points.push({
      model: tb3.model,
      agent: tb3.agent,
      tb3Accuracy: tb3.accuracy,
      tb3ReasoningEffort: tb3.reasoningEffort,
      terminalAccuracy: terminal.accuracy,
      terminalReasoningEffort: terminal.reasoningEffort,
      linked: true,
    });
  }

  return points.sort((a, b) => b.tb3Accuracy - a.tb3Accuracy);
}

export const DISCRIMINATION_SLOPE_DATA = buildDiscriminationSlopeData();
