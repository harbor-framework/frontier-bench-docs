import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { QueryProvider } from '@/components/providers/query-provider';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      <QueryProvider>{children}</QueryProvider>
    </HomeLayout>
  );
}
