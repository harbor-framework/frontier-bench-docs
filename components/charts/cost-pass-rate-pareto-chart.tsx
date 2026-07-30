import { ANNOUNCEMENT_COST_PARETO_DATA } from '@/lib/announcement-pareto';

const WIDTH = 720;
const HEIGHT = 400;
const MARGIN = { top: 36, right: 148, bottom: 52, left: 56 };
const DOT_HALF = 4;
const FRONTIER_DOT_HALF = 5;

function niceTicks(min: number, max: number, count: number): number[] {
  if (!(max > min) || count < 2) return [min, max];
  const span = max - min;
  const step = span / (count - 1);
  const raw = 10 ** Math.floor(Math.log10(step));
  const err = step / raw;
  const niceStep =
    err >= 7.5 ? 10 * raw : err >= 3.5 ? 5 * raw : err >= 1.5 ? 2 * raw : raw;
  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + niceStep * 0.5; v += niceStep) {
    ticks.push(Math.round(v * 1e6) / 1e6);
  }
  return ticks;
}

function formatCost(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

function formatAccuracy(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function CostPassRateParetoChart() {
  const data = ANNOUNCEMENT_COST_PARETO_DATA;
  const plotW = WIDTH - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const xPad = (Math.max(...xs) - Math.min(...xs)) * 0.08 || Math.max(...xs) * 0.05;
  const yPad = (Math.max(...ys) - Math.min(...ys)) * 0.12 || 4;
  const xTicks = niceTicks(Math.max(0, Math.min(...xs) - xPad), Math.max(...xs) + xPad, 5);
  const yTicks = niceTicks(
    Math.max(0, Math.min(...ys) - yPad),
    Math.min(100, Math.max(...ys) + yPad),
    5,
  );
  const xMin = xTicks[0]!;
  const xMax = xTicks[xTicks.length - 1]!;
  const yMin = yTicks[0]!;
  const yMax = yTicks[yTicks.length - 1]!;

  const xScale = (value: number) =>
    MARGIN.left + ((value - xMin) / (xMax - xMin || 1)) * plotW;
  const yScale = (value: number) =>
    MARGIN.top + (1 - (value - yMin) / (yMax - yMin || 1)) * plotH;

  const frontier = data.filter((d) => d.onFrontier).sort((a, b) => a.x - b.x);
  const frontierPath = frontier
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.x)} ${yScale(d.y)}`)
    .join(' ');

  return (
    <figure className="my-6 not-prose">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Cost vs pass rate Pareto chart on Terminal-Bench 3.0"
        className="mx-auto block max-w-full"
      >
        <text
          x={MARGIN.left}
          y={20}
          className="fill-muted-foreground font-mono"
          fontSize={11}
        >
          Cost vs Pass Rate
        </text>

        {xTicks.slice(1, -1).map((tick) => (
          <line
            key={`x-grid-${tick}`}
            x1={xScale(tick)}
            y1={MARGIN.top}
            x2={xScale(tick)}
            y2={MARGIN.top + plotH}
            className="stroke-border"
            strokeWidth={1}
          />
        ))}
        {yTicks.slice(1, -1).map((tick) => (
          <line
            key={`y-grid-${tick}`}
            x1={MARGIN.left}
            y1={yScale(tick)}
            x2={MARGIN.left + plotW}
            y2={yScale(tick)}
            className="stroke-border"
            strokeWidth={1}
          />
        ))}

        <line
          x1={MARGIN.left}
          y1={MARGIN.top + plotH}
          x2={MARGIN.left + plotW}
          y2={MARGIN.top + plotH}
          className="stroke-muted-foreground/40"
          strokeWidth={1}
        />
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={MARGIN.top + plotH}
          className="stroke-muted-foreground/40"
          strokeWidth={1}
        />

        {xTicks.map((tick) => (
          <text
            key={`x-label-${tick}`}
            x={xScale(tick)}
            y={MARGIN.top + plotH + 20}
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            fontSize={11}
          >
            {formatCost(tick)}
          </text>
        ))}
        {yTicks.map((tick) => (
          <text
            key={`y-label-${tick}`}
            x={MARGIN.left - 10}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="central"
            className="fill-muted-foreground font-mono"
            fontSize={11}
          >
            {formatAccuracy(tick)}
          </text>
        ))}

        <text
          x={MARGIN.left + plotW / 2}
          y={HEIGHT - 10}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize={11}
        >
          Cost (USD)
        </text>
        <g transform={`translate(14 ${MARGIN.top + plotH / 2}) rotate(-90)`}>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground font-mono"
            fontSize={11}
          >
            Pass Rate (%)
          </text>
        </g>

        {frontierPath ? (
          <path
            d={frontierPath}
            fill="none"
            className="stroke-foreground/50"
            strokeWidth={1.5}
          />
        ) : null}

        {data.map((datum) => {
          const cx = xScale(datum.x);
          const cy = yScale(datum.y);
          const half = datum.onFrontier ? FRONTIER_DOT_HALF : DOT_HALF;
          const size = half * 2;
          const agentPart = ` (${datum.agent})`;
          let modelText = datum.model;
          if (modelText.length + agentPart.length > 22) {
            const budget = Math.max(1, 22 - agentPart.length - 1);
            modelText =
              modelText.length > budget
                ? `${modelText.slice(0, budget)}…`
                : modelText;
          }
          return (
            <g key={datum.id}>
              <rect
                x={cx - half}
                y={cy - half}
                width={size}
                height={size}
                className={
                  datum.onFrontier
                    ? 'fill-foreground'
                    : 'fill-muted-foreground/35'
                }
              />
              <text
                x={cx + half + 6}
                y={cy - (half + 2)}
                textAnchor="start"
                className={
                  datum.onFrontier
                    ? 'fill-foreground font-mono'
                    : 'fill-muted-foreground font-mono'
                }
                fontSize={11}
              >
                <tspan>{modelText}</tspan>
                <tspan
                  className={
                    datum.onFrontier
                      ? 'fill-muted-foreground'
                      : 'fill-muted-foreground/70'
                  }
                >
                  {agentPart}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        Cost vs Pass Rate · Solid line is the Pareto front
      </figcaption>
    </figure>
  );
}
