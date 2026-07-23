import { AppProviders } from '@/components/providers/app-providers';
import { GeistSans } from 'geist/font/sans';
import { Google_Sans_Code } from 'next/font/google';
import { cn } from '@/lib/utils';
import './global.css';

const googleSansCode = Google_Sans_Code({
  subsets: ['latin'],
  variable: '--font-google-sans-code',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(
        googleSansCode.variable,
        GeistSans.variable,
        'font-sans',
      )}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
