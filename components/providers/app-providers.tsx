'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * next-themes (used by fumadocs RootProvider) injects an inline <script>.
 * React 19 warns about that during client render. Keep the executable script
 * on the server (FOUC prevention), and mark it non-JS on the client.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <NuqsAdapter>
      <RootProvider
        theme={{
          scriptProps:
            typeof window === 'undefined'
              ? undefined
              : { type: 'application/json' },
        }}
      >
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </RootProvider>
    </NuqsAdapter>
  );
}
