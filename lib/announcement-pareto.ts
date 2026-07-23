import {
  ANNOUNCEMENT_COST_PARETO_EXCLUSIONS,
  ANNOUNCEMENT_LEADERBOARD_SNAPSHOT,
  type AnnouncementLeaderboardEntry,
} from '@/lib/announcement-leaderboard-snapshot';

export type AnnouncementParetoPoint = {
  id: string;
  model: string;
  agent: string;
  /** Cost in USD (x). */
  x: number;
  /** Pass rate % (y). */
  y: number;
  onFrontier: boolean;
};

function isExcluded(model: string): boolean {
  return (ANNOUNCEMENT_COST_PARETO_EXCLUSIONS as readonly string[]).includes(
    model,
  );
}

/** Pareto frontier for maximize-y / minimize-x (landing-page cost chart). */
export function computeCostAccuracyFrontier(
  points: Array<Omit<AnnouncementParetoPoint, 'onFrontier'>>,
): Set<string> {
  const frontier = new Set<string>();
  for (const point of points) {
    const dominated = points.some(
      (other) =>
        other.id !== point.id &&
        other.x <= point.x &&
        other.y >= point.y &&
        (other.x < point.x || other.y > point.y),
    );
    if (!dominated) frontier.add(point.id);
  }
  return frontier;
}

export function buildAnnouncementCostParetoData(
  rows: readonly AnnouncementLeaderboardEntry[] = ANNOUNCEMENT_LEADERBOARD_SNAPSHOT,
): AnnouncementParetoPoint[] {
  const points = rows
    .filter(
      (row) =>
        row.status === 'display' &&
        !isExcluded(row.model) &&
        row.totalCostUsd > 0,
    )
    .map((row) => ({
      id: `${row.agent}||${row.model}`,
      model: row.model,
      agent: row.agent,
      x: row.totalCostUsd,
      y: row.accuracy,
    }));

  const frontier = computeCostAccuracyFrontier(points);
  return points
    .map((point) => ({
      ...point,
      onFrontier: frontier.has(point.id),
    }))
    .sort((a, b) => a.x - b.x);
}

export const ANNOUNCEMENT_COST_PARETO_DATA = buildAnnouncementCostParetoData();
