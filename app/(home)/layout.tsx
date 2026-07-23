import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { QueryProvider } from '@/components/providers/query-provider';
import { SiteFooter } from '@/components/site-footer';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      <QueryProvider>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
          <div className="mx-auto w-full min-w-0 max-w-8xl px-4">
            <SiteFooter />
          </div>
        </div>
      </QueryProvider>
    </HomeLayout>
  );
}
