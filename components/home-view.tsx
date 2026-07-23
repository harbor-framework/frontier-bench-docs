'use client';

import { useQueryState } from 'nuqs';
import type { ReactNode } from 'react';

import { ParetoView } from '@/components/charts/pareto-view';
import {
  parseHomeView,
  type HomeViewId,
} from '@/components/home-view-toggle';

type HomeViewProps = {
  leaderboard: ReactNode;
};

function ViewContent({
  view,
  leaderboard,
}: {
  view: HomeViewId;
  leaderboard: ReactNode;
}) {
  switch (view) {
    case 'leaderboard':
      return leaderboard;
    case 'pareto':
      return <ParetoView />;
    default: {
      const _exhaustive: never = view;
      return _exhaustive;
    }
  }
}

export function HomeView({ leaderboard }: HomeViewProps) {
  const [view] = useQueryState('view', parseHomeView);

  return <ViewContent view={view} leaderboard={leaderboard} />;
}
