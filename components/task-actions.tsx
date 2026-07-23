import { ArrowRight01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { buttonVariants } from '@/components/ui/button';
import {
  FRONTIER_BENCH_PACKAGE,
  harborDatasetUrl,
} from '@/lib/leaderboard';
import { gitConfig } from '@/lib/shared';

export function TaskActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <a
        href={harborDatasetUrl(FRONTIER_BENCH_PACKAGE)}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ variant: 'secondary', size: 'lg' })}
      >
        View the tasks
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
      </a>
      <a
        href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ variant: 'secondary', size: 'lg' })}
      >
        Contribute a task
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
      </a>
    </div>
  );
}
