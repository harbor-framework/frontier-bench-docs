import { DocsLayout } from 'fumadocs-ui/layouts/docs';

import { SiteFooter } from '@/components/site-footer';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
        <div className="mx-auto w-full min-w-0 max-w-8xl px-4">
          <SiteFooter />
        </div>
      </div>
    </DocsLayout>
  );
}
