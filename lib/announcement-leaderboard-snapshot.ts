/**
 * Snapshot of the public Terminal-Bench 3.0 leaderboard for the announcement page.
 *
 * Exported via:
 *   harbor hub leaderboard show terminal-bench/terminal-bench/terminal-bench --json
 *
 * This is intentionally static so the announcement chart stays a point-in-time
 * snapshot rather than tracking live Hub updates.
 */

export type AnnouncementLeaderboardEntry = {
  rank: number | null;
  status: 'display' | 'hide';
  model: string;
  agent: string;
  reasoningEffort: string | null;
  /** Mean pass rate as a percentage (0–100). */
  accuracy: number;
  accuracyStderr: number;
  /** Aggregate trial cost in USD (`metrics.total_cost_usd`). */
  totalCostUsd: number;
  /** Aggregate token usage (`metrics.total_tokens`). */
  totalTokens: number;
};

/** Hub `leaderboard.updated_at` at export time. */
export const ANNOUNCEMENT_LEADERBOARD_UPDATED_AT =
  '2026-07-23T08:48:47.175105+00:00';

/**
 * Models omitted from the announcement cost/token Pareto charts due to
 * unreliable cost reporting (see announcement footnote).
 */
export const ANNOUNCEMENT_COST_PARETO_EXCLUSIONS = [
  'Grok 4.5',
  'Kimi K3',
] as const;

export const ANNOUNCEMENT_LEADERBOARD_SNAPSHOT: readonly AnnouncementLeaderboardEntry[] =
  [
    {
      rank: null,
      status: 'hide',
      model: 'GPT-5.6 Sol',
      agent: 'mini-SWE-agent',
      reasoningEffort: 'max',
      accuracy: 34.59,
      accuracyStderr: 1.7,
      totalCostUsd: 4811.08,
      totalTokens: 4069639074,
    },
    {
      rank: 1,
      status: 'display',
      model: 'GPT-5.6 Sol',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 34.42,
      accuracyStderr: 1.61,
      totalCostUsd: 3956.28,
      totalTokens: 5767980227,
    },
    {
      rank: 2,
      status: 'display',
      model: 'Fable 5',
      agent: 'Claude Code',
      reasoningEffort: 'max',
      accuracy: 33.78,
      accuracyStderr: 1.73,
      totalCostUsd: 7005.8,
      totalTokens: 3555430559,
    },
    {
      rank: 3,
      status: 'display',
      model: 'Opus 4.8',
      agent: 'Claude Code',
      reasoningEffort: 'max',
      accuracy: 21.08,
      accuracyStderr: 1.55,
      totalCostUsd: 5707.47,
      totalTokens: 5214500207,
    },
    {
      rank: 4,
      status: 'display',
      model: 'GPT-5.6 Terra',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 20.81,
      accuracyStderr: 1.4,
      totalCostUsd: 2484.52,
      totalTokens: 7024607919,
    },
    {
      rank: 5,
      status: 'display',
      model: 'Grok 4.5',
      agent: 'Cursor CLI',
      reasoningEffort: 'xhigh',
      accuracy: 17.84,
      accuracyStderr: 1.44,
      totalCostUsd: 1083.92,
      totalTokens: 1425139144,
    },
    {
      rank: 6,
      status: 'display',
      model: 'Sonnet 5',
      agent: 'Claude Code',
      reasoningEffort: 'max',
      accuracy: 14.59,
      accuracyStderr: 1.5,
      totalCostUsd: 7937.67,
      totalTokens: 17947338522,
    },
    {
      rank: 7,
      status: 'display',
      model: 'GPT-5.6 Luna',
      agent: 'Codex',
      reasoningEffort: 'max',
      accuracy: 14.32,
      accuracyStderr: 1.25,
      totalCostUsd: 1653.7,
      totalTokens: 12047530572,
    },
    {
      rank: null,
      status: 'hide',
      model: 'GPT-5.6 Sol',
      agent: 'OpenCode',
      reasoningEffort: 'max',
      accuracy: 12.43,
      accuracyStderr: 1.32,
      totalCostUsd: 823.78,
      totalTokens: 834767422,
    },
    {
      rank: null,
      status: 'hide',
      model: 'Muse Spark 1.1',
      agent: 'OpenCode',
      reasoningEffort: 'max',
      accuracy: 5.68,
      accuracyStderr: 0.81,
      totalCostUsd: 1042.41,
      totalTokens: 2911384591,
    },
    {
      rank: 8,
      status: 'display',
      model: 'GLM 5.2',
      agent: 'Claude Code',
      reasoningEffort: 'max',
      accuracy: 5.14,
      accuracyStderr: 1.01,
      totalCostUsd: 4172.18,
      totalTokens: 3841631239,
    },
    {
      rank: null,
      status: 'hide',
      model: 'Kimi K3',
      agent: 'Kimi CLI',
      reasoningEffort: 'max',
      accuracy: 3.52,
      accuracyStderr: 0.74,
      totalCostUsd: 1172.3,
      totalTokens: 2043973972,
    },
  ] as const;
