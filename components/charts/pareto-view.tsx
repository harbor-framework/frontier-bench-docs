'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useMemo } from 'react';

import {
  DEFAULT_PARETO_X,
  DEFAULT_PARETO_Y,
  PARETO_AXES,
  PARETO_X_AXIS_IDS,
  isParetoXAxisId,
} from '@/components/charts/pareto-axes';
import {
  ParetoScatterChart,
  buildParetoData,
} from '@/components/charts/pareto-scatter-chart';
import { HomeViewToggle } from '@/components/home-view-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FRONTIER_BENCH_LEADERBOARD,
  FRONTIER_BENCH_PACKAGE,
  fetchLeaderboard,
  leaderboardQueryKey,
} from '@/lib/leaderboard';

const parseParetoXAxis = parseAsStringLiteral(PARETO_X_AXIS_IDS);

export function ParetoView() {
  const [xAxisId, setXAxisId] = useQueryState(
    'x',
    parseParetoXAxis.withDefault(DEFAULT_PARETO_X),
  );

  const yAxisId = DEFAULT_PARETO_Y;

  const { data, error, isPending } = useQuery({
    queryKey: leaderboardQueryKey(
      FRONTIER_BENCH_PACKAGE,
      FRONTIER_BENCH_LEADERBOARD,
    ),
    queryFn: () =>
      fetchLeaderboard(FRONTIER_BENCH_PACKAGE, FRONTIER_BENCH_LEADERBOARD),
  });

  const chartData = useMemo(
    () => (data ? buildParetoData(data.rows, xAxisId, yAxisId) : []),
    [data, xAxisId, yAxisId],
  );

  const xLabel = PARETO_AXES[xAxisId].label;
  const yLabel = PARETO_AXES[yAxisId].label;

  if (isPending) {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <div className="flex items-center justify-end">
          <HomeViewToggle />
        </div>
        <div className="w-full rounded-xl border px-4 py-10 text-center text-sm text-muted-foreground">
          Loading Pareto…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <div className="flex items-center justify-end">
          <HomeViewToggle />
        </div>
        <div className="w-full rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-10 text-center text-sm text-destructive">
          {error?.message ?? 'Failed to load Pareto data'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-end">
        <HomeViewToggle />
      </div>
      <div className="w-full overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 uppercase">
          <span className="text-sm text-muted-foreground">{yLabel} vs</span>
          <Select
            value={xAxisId}
            onValueChange={(next) => {
              if (typeof next === 'string' && isParetoXAxisId(next)) {
                void setXAxisId(next);
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className="min-w-36 bg-background uppercase dark:bg-card"
            >
              <SelectValue>{xLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              {PARETO_X_AXIS_IDS.map((axisId) => (
                <SelectItem key={axisId} value={axisId} className="uppercase">
                  {PARETO_AXES[axisId].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ParetoScatterChart
          data={chartData}
          xAxisId={xAxisId}
          yAxisId={yAxisId}
          className="px-2 py-3"
        />
      </div>
    </div>
  );
}
