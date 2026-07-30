import {
  TOKENS_VS_STEPS_SNAPSHOT,
  type TrialOutcome,
} from '@/lib/tokens-vs-steps-snapshot';

const M = { t: 30, r: 12, b: 40, l: 56 };
const PW = 356;
const PH = 196;
const GAPX = 20;
const GAPY = 52;
const WIDTH = M.l + PW * 2 + GAPX + M.r;
const HEIGHT = M.t + PH * 2 + GAPY + M.b;

const X_TICKS = [0, 250, 500, 750, 1000, 1250] as const;
const Y_TICKS = [0, 200_000, 400_000, 600_000, 800_000] as const;

const OUTCOME_ORDER: Record<TrialOutcome, number> = { f: 0, e: 1, p: 2 };

function formatTokens(value: number): string {
  return value ? `${value / 1000}k` : '0';
}

function outcomeClass(outcome: TrialOutcome): string {
  switch (outcome) {
    case 'p':
      return 'fill-foreground';
    case 'f':
      return 'fill-muted-foreground/55';
    case 'e':
      return 'fill-muted-foreground/30';
    default: {
      const _exhaustive: never = outcome;
      return _exhaustive;
    }
  }
}

export function TokensVsStepsChart() {
  const { panels, xMax, yMax } = TOKENS_VS_STEPS_SNAPSHOT;

  return (
    <figure className="my-6 not-prose">
      <div className="mb-2 flex items-baseline justify-between font-mono text-[11.5px] text-muted-foreground">
        <span>Output Tokens vs Steps, Per Trial</span>
        <span>Terminal-Bench 3.0</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Per-trial output tokens against steps, four panels"
        className="mx-auto block max-w-full overflow-visible"
      >
        {panels.map((panel, index) => {
          const col = index % 2;
          const row = (index / 2) | 0;
          const ox = M.l + col * (PW + GAPX);
          const oy = M.t + row * (PH + GAPY);
          const xScale = (steps: number) => ox + (steps / xMax) * PW;
          const yScale = (tokens: number) => oy + PH - (tokens / yMax) * PH;
          const points = [...panel.pts].sort(
            (a, b) => OUTCOME_ORDER[a[2]] - OUTCOME_ORDER[b[2]],
          );

          return (
            <g key={panel.id}>
              {X_TICKS.map((tick) => (
                <g key={`x-${panel.id}-${tick}`}>
                  <line
                    x1={xScale(tick)}
                    y1={oy}
                    x2={xScale(tick)}
                    y2={oy + PH}
                    className="stroke-border"
                    strokeWidth={1}
                  />
                  <text
                    x={xScale(tick)}
                    y={oy + PH + 14}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono"
                    fontSize={9.5}
                  >
                    {tick}
                  </text>
                </g>
              ))}

              {Y_TICKS.map((tick) => (
                <g key={`y-${panel.id}-${tick}`}>
                  <line
                    x1={ox}
                    y1={yScale(tick)}
                    x2={ox + PW}
                    y2={yScale(tick)}
                    className="stroke-border"
                    strokeWidth={1}
                  />
                  {col === 0 ? (
                    <text
                      x={ox - 8}
                      y={yScale(tick) + 3.5}
                      textAnchor="end"
                      className="fill-muted-foreground font-mono"
                      fontSize={9.5}
                    >
                      {formatTokens(tick)}
                    </text>
                  ) : null}
                </g>
              ))}

              <rect
                x={ox}
                y={oy}
                width={PW}
                height={PH}
                className="fill-none stroke-border"
                strokeWidth={1}
              />

              <text
                x={ox}
                y={oy - 13}
                className="fill-foreground font-mono"
                fontSize={11.5}
              >
                {panel.name}
              </text>
              <text
                x={ox + PW}
                y={oy - 13}
                textAnchor="end"
                className="fill-muted-foreground font-mono"
                fontSize={10}
              >
                {`${panel.acc}%  ·  n=${panel.n}`}
              </text>

              {points.map(([steps, tokens, outcome], pointIndex) => (
                <circle
                  key={`${panel.id}-${pointIndex}`}
                  cx={xScale(steps)}
                  cy={yScale(tokens)}
                  r={2.3}
                  className={outcomeClass(outcome)}
                  fillOpacity={outcome === 'p' ? 0.95 : 0.7}
                />
              ))}

              <text
                x={ox + PW / 2}
                y={oy + PH + 31}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                fontSize={10.5}
              >
                Steps
              </text>
            </g>
          );
        })}

        <text
          textAnchor="middle"
          transform={`rotate(-90 14 ${M.t + PH + GAPY / 2})`}
          x={14}
          y={M.t + PH + GAPY / 2}
          className="fill-muted-foreground font-mono"
          fontSize={10.5}
        >
          Output Tokens
        </text>
      </svg>
      <figcaption className="mt-3 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-foreground" />
          Pass
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-muted-foreground/55" />
          Fail
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-muted-foreground/30" />
          Error
        </span>
        <span>Each point is one trial</span>
      </figcaption>
    </figure>
  );
}
