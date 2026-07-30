import { ANNOUNCEMENT_LEADERBOARD_SNAPSHOT } from '@/lib/announcement-leaderboard-snapshot';

const ROW_HEIGHT = 38;
const LABEL_WIDTH = 180;
const VALUE_WIDTH = 52;
const MARGIN = { top: 8, right: 8, bottom: 28, left: 8 };
const BAR_HEIGHT = 22;
/** Match the landing-page resolution-rate bars: always scale against 100%. */
const MAX_ACCURACY = 100;
const TICKS = [0, 25, 50, 75, 100] as const;

function formatPassRate(value: number): string {
  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })}%`;
}

export function PassRateBarChart() {
  const rows = ANNOUNCEMENT_LEADERBOARD_SNAPSHOT.filter(
    (row) => row.status === 'display',
  ).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  const width = 640;
  const plotWidth = width - MARGIN.left - MARGIN.right - LABEL_WIDTH - VALUE_WIDTH;
  const height = MARGIN.top + MARGIN.bottom + rows.length * ROW_HEIGHT;

  return (
    <figure className="my-6 not-prose">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          role="img"
          aria-label="Pass rates on Terminal-Bench 3.0"
          className="mx-auto block max-w-full text-foreground"
        >
          {TICKS.map((tick) => {
            const x = MARGIN.left + LABEL_WIDTH + (tick / MAX_ACCURACY) * plotWidth;
            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={MARGIN.top}
                  x2={x}
                  y2={MARGIN.top + rows.length * ROW_HEIGHT}
                  className="stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize={11}
                >
                  {`${tick}%`}
                </text>
              </g>
            );
          })}

          {rows.map((row, index) => {
            const y = MARGIN.top + index * ROW_HEIGHT;
            const barY = y + (ROW_HEIGHT - BAR_HEIGHT) / 2;
            const barWidth = (row.accuracy / MAX_ACCURACY) * plotWidth;
            const label = `${row.model} (${row.agent})`;

            return (
              <g key={`${row.rank}-${row.model}-${row.agent}`}>
                <text
                  x={MARGIN.left + LABEL_WIDTH - 12}
                  y={y + ROW_HEIGHT / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="fill-foreground"
                  fontSize={12}
                >
                  {label}
                </text>
                <rect
                  x={MARGIN.left + LABEL_WIDTH}
                  y={barY}
                  width={plotWidth}
                  height={BAR_HEIGHT}
                  className="fill-muted"
                />
                <rect
                  x={MARGIN.left + LABEL_WIDTH}
                  y={barY}
                  width={Math.max(barWidth, 1)}
                  height={BAR_HEIGHT}
                  className="fill-foreground/80"
                />
                <text
                  x={MARGIN.left + LABEL_WIDTH + plotWidth + 8}
                  y={y + ROW_HEIGHT / 2}
                  dominantBaseline="central"
                  className="fill-muted-foreground"
                  fontSize={12}
                >
                  {formatPassRate(row.accuracy)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        Pass Rates on Terminal-Bench 3.0
      </figcaption>
    </figure>
  );
}
