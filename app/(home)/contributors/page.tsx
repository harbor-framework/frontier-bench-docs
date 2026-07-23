import { ContributorsGrid } from '@/components/contributors-grid';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contributors',
  description: 'People and organizations behind Frontier-Bench.',
};

export default function ContributorsPage() {
  return (
    <article
      className={cn(
        'content-page mx-auto w-full max-w-4xl flex-1 px-4 py-12',
        GeistSans.className,
      )}
    >
      <h1>Contributors</h1>
      <p className="mb-10 text-muted-foreground">
        The people and organizations building Frontier-Bench.
      </p>
      <ContributorsGrid />
    </article>
  );
}
