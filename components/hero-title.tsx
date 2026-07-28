'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function DigitReel({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden">
      {/* Keeps the reel on the text baseline while the strip is absolutely positioned. */}
      <span aria-hidden className="invisible">
        0
      </span>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
        initial={{ y: 0 }}
        animate={{ y: `${-value}em` }}
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 8,
          mass: 1.1,
        }}
      >
        {DIGITS.map((digit) => (
          <span
            key={digit}
            className="block h-[1em] w-[1ch] text-center leading-[1em]"
          >
            {digit}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function HeroTitle() {
  const [tenths, setTenths] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setTenths(1);
    }, 80);

    return () => {
      window.clearTimeout(id);
    };
  }, []);

  return (
    <h1 className="max-w-full px-1 text-pretty text-4xl font-normal tracking-tighter uppercase sm:text-5xl md:text-7xl">
      FRONTIER-BENCH v
      <span className="inline-flex items-baseline leading-none tracking-tighter tabular-nums">
        0.
        <DigitReel value={tenths} />
      </span>
    </h1>
  );
}
