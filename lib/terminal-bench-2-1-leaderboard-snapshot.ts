/**
 * Snapshot of the public Terminal-Bench 2.1 leaderboard for the announcement page.
 *
 * Exported via:
 *   harbor hub leaderboard show terminal-bench/terminal-bench-2-1/main --json
 *
 * Intentionally static so announcement charts stay a point-in-time snapshot.
 */

export type TerminalBenchLeaderboardEntry = {
  rank: number | null;
  status: 'display' | 'hide';
  model: string;
  agent: string;
  reasoningEffort: string | null;
  /** Mean pass rate as a percentage (0–100). */
  accuracy: number;
  accuracyStderr: number | null;
};

/** Hub `leaderboard.updated_at` at export time. */
export const TERMINAL_BENCH_2_1_LEADERBOARD_UPDATED_AT =
  '2026-07-14T15:54:27.418928+00:00';

export const TERMINAL_BENCH_2_1_LEADERBOARD_SNAPSHOT: readonly TerminalBenchLeaderboardEntry[] =
  [
    {
      rank: 1,
      status: 'display',
      model: 'Fable 5',
      agent: 'Claude Code',
      reasoningEffort: 'xhigh',
      accuracy: 83.82,
      accuracyStderr: 1.16,
    },
    {
      rank: 2,
      status: 'display',
      model: 'GPT-5.5',
      agent: 'Codex',
      reasoningEffort: 'xhigh',
      accuracy: 83.15,
      accuracyStderr: 1.13,
    },
    {
      rank: 3,
      status: 'display',
      model: 'Fable 5',
      agent: 'Terminus 2',
      reasoningEffort: 'high',
      accuracy: 80.45,
      accuracyStderr: 1.16,
    },
    {
      rank: 4,
      status: 'display',
      model: 'Grok 4.5',
      agent: 'Cursor CLI',
      reasoningEffort: 'high',
      accuracy: 79.33,
      accuracyStderr: 1.46,
    },
    {
      rank: 5,
      status: 'display',
      model: 'Opus 4.8',
      agent: 'Claude Code',
      reasoningEffort: 'high',
      accuracy: 78.88,
      accuracyStderr: 1.31,
    },
    {
      rank: 6,
      status: 'display',
      model: 'GPT-5.6 Terra',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 78.43,
      accuracyStderr: 1.25,
    },
    {
      rank: 7,
      status: 'display',
      model: 'GPT-5.5',
      agent: 'Terminus 2',
      reasoningEffort: 'xhigh',
      accuracy: 77.98,
      accuracyStderr: 1.22,
    },
    {
      rank: 8,
      status: 'display',
      model: 'Muse Spark 1.1',
      agent: 'mini-SWE-agent',
      reasoningEffort: 'xhigh',
      accuracy: 76.18,
      accuracyStderr: 1.23,
    },
    {
      rank: null,
      status: 'hide',
      model: 'GPT-5.6 Sol',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 76.18,
      accuracyStderr: 1.28,
    },
    {
      rank: 9,
      status: 'display',
      model: 'GPT-5.6 Luna',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 75.73,
      accuracyStderr: 1.32,
    },
    {
      rank: 10,
      status: 'display',
      model: 'Sonnet 5',
      agent: 'Claude Code',
      reasoningEffort: 'high',
      accuracy: 74.61,
      accuracyStderr: 1.64,
    },
    {
      rank: null,
      status: 'hide',
      model: 'GPT-5.6 Terra',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 74.38,
      accuracyStderr: 1.54,
    },
    {
      rank: 11,
      status: 'display',
      model: 'Gemini 3 Pro',
      agent: 'Terminus 2',
      reasoningEffort: 'high',
      accuracy: 73.93,
      accuracyStderr: 1.29,
    },
    {
      rank: null,
      status: 'hide',
      model: 'GPT-5.6 Luna',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 71.24,
      accuracyStderr: 1.39,
    },
    {
      rank: 12,
      status: 'display',
      model: 'Opus 4.7',
      agent: 'Claude Code',
      reasoningEffort: 'max',
      accuracy: 68.9,
      accuracyStderr: 1.41,
    },
    {
      rank: 13,
      status: 'display',
      model: 'Opus 4.7',
      agent: 'Terminus 2',
      reasoningEffort: 'max',
      accuracy: 66.07,
      accuracyStderr: 1.37,
    },
    {
      rank: 14,
      status: 'display',
      model: 'Gemini 3 Pro',
      agent: 'Gemini CLI',
      reasoningEffort: 'high',
      accuracy: 65.84,
      accuracyStderr: 1.38,
    },
    {
      rank: 14,
      status: 'display',
      model: 'Gemini 3.1 Pro',
      agent: 'Gemini CLI',
      reasoningEffort: 'high',
      accuracy: 65.84,
      accuracyStderr: 1.67,
    },
    {
      rank: 16,
      status: 'display',
      model: 'Gemini 3.1 Pro',
      agent: 'Terminus 2',
      reasoningEffort: 'high',
      accuracy: 65.62,
      accuracyStderr: 1.65,
    },
    {
      rank: 17,
      status: 'display',
      model: 'GLM-5.1',
      agent: 'Claude Code',
      reasoningEffort: 'max',
      accuracy: 58.65,
      accuracyStderr: 1.24,
    },
  ] as const;
