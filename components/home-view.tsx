'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';
import type { ReactNode } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const VIEWS = ['leaderboard', 'charts'] as const;

type HomeViewProps = {
  leaderboard: ReactNode;
};

export function HomeView({ leaderboard }: HomeViewProps) {
  const [view, setView] = useQueryState(
    'view',
    parseAsStringLiteral(VIEWS).withDefault('leaderboard'),
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex justify-center">
        <ToggleGroup
          value={[view]}
          onValueChange={(next) => {
            const value = next[0];
            if (value === 'leaderboard' || value === 'charts') {
              void setView(value);
            }
          }}
          variant="outline"
          spacing={0}
          className="border"
        >
          <ToggleGroupItem value="leaderboard" className="px-4">
            Leaderboard
          </ToggleGroupItem>
          <ToggleGroupItem value="charts" className="px-4">
            Charts
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === 'leaderboard' ? (
        leaderboard
      ) : (
        <div className="rounded-xl border bg-card px-4 py-16 text-center text-sm text-muted-foreground shadow-xl shadow-sidebar dark:shadow-none">
          Charts coming soon.
        </div>
      )}
    </div>
  );
}
