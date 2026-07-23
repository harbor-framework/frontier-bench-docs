import { RootProvider } from 'fumadocs-ui/provider/next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cn } from '@/lib/utils';
import './global.css';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, 'font-sans')}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <NuqsAdapter>
          <RootProvider>{children}</RootProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
