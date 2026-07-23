'use client';

import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

function HugeCopyButton({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const pre = containerRef.current?.getElementsByTagName('pre').item(0);
    if (!pre) return;

    const clone = pre.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
      node.replaceWith('\n');
    });

    try {
      await navigator.clipboard.writeText(clone.textContent ?? '');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore clipboard failures.
    }
  }

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied Text' : 'Copy Text'}
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-lg text-fd-muted-foreground transition-colors',
        'hover:bg-fd-accent hover:text-fd-accent-foreground',
      )}
      onClick={() => {
        void handleCopy();
      }}
    >
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy01Icon}
        strokeWidth={2}
        className="size-3.5"
      />
    </button>
  );
}

export function MdxPre({ children, ...props }: ComponentProps<'pre'>) {
  const viewportRef = useRef<HTMLElement | null>(null);

  return (
    <CodeBlock
      {...props}
      allowCopy={false}
      viewportProps={
        {
          ref: viewportRef,
        } as HTMLAttributes<HTMLElement>
      }
      Actions={({ className }: { className?: string; children?: ReactNode }) => (
        <div className={cn('empty:hidden', className)}>
          <HugeCopyButton containerRef={viewportRef} />
        </div>
      )}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}
