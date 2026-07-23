import { ANNOUNCEMENT_LEADERBOARD_SNAPSHOT } from '@/lib/announcement-leaderboard-snapshot';
import { TERMINAL_BENCH_2_1_LEADERBOARD_SNAPSHOT } from '@/lib/terminal-bench-2-1-leaderboard-snapshot';

export type DiscriminationSlopePoint = {
  model: string;
  agent: string;
  /** Frontier-Bench pass rate (%). */
  frontierAccuracy: number;
  frontierReasoningEffort: string | null;
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
 * Pick the Terminal-Bench row that best matches a Frontier-Bench row:
 * 1. same agent + model + reasoning effort
 * 2. else same agent + model, preferring `display`, then higher accuracy
 */
function findTerminalMatch(frontier: Matchable): Matchable | null {
  const candidates = TERMINAL_BENCH_2_1_LEADERBOARD_SNAPSHOT.filter(
    (row) => row.agent === frontier.agent && row.model === frontier.model,
  );
  if (candidates.length === 0) return null;

  const exact = candidates.find(
    (row) =>
      row.reasoningEffort != null &&
      row.reasoningEffort === frontier.reasoningEffort,
  );
  if (exact) return exact;

  return [...candidates].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'display' ? -1 : 1;
    return b.accuracy - a.accuracy;
  })[0]!;
}

/**
 * Slope-chart rows: Frontier-Bench *display* entries that also have a matching
 * Terminal-Bench agent+model run (reasoning matched when possible).
 * Unmatched right-side-only points are omitted.
 */
export function buildDiscriminationSlopeData(): DiscriminationSlopePoint[] {
  const points: DiscriminationSlopePoint[] = [];
  const seen = new Set<string>();

  for (const frontier of ANNOUNCEMENT_LEADERBOARD_SNAPSHOT) {
    if (frontier.status !== 'display') continue;
    if (frontier.model === 'GPT-5.6 Sol') continue;
    const key = agentModelKey(frontier);
    if (seen.has(key)) continue;
    seen.add(key);

    const terminal = findTerminalMatch(frontier);
    if (terminal == null) continue;

    points.push({
      model: frontier.model,
      agent: frontier.agent,
      frontierAccuracy: frontier.accuracy,
      frontierReasoningEffort: frontier.reasoningEffort,
      terminalAccuracy: terminal.accuracy,
      terminalReasoningEffort: terminal.reasoningEffort,
      linked: true,
    });
  }

  return points.sort((a, b) => b.frontierAccuracy - a.frontierAccuracy);
}

export const DISCRIMINATION_SLOPE_DATA = buildDiscriminationSlopeData();
