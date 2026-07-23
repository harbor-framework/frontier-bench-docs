import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      {
        text: 'RUN FRONTIER-BENCH',
        url: '/run',
      },
      {
        text: 'ANNOUNCEMENT',
        url: '/announcement',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    themeSwitch: {
      mode: 'light-dark-system',
    },
  };
}
