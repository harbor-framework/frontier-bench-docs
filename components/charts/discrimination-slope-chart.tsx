import { DISCRIMINATION_SLOPE_DATA } from '@/lib/discrimination-slope-data';

const WIDTH = 720;
const HEIGHT = 420;
const MARGIN = { top: 56, right: 200, bottom: 28, left: 200 };
const LEFT_X = MARGIN.left;
const RIGHT_X = WIDTH - MARGIN.right;
const DOT_R = 4.5;
const MIN_LABEL_GAP = 16;

function formatPct(value: number): string {
  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })}%`;
}

function yScale(accuracy: number, yMin: number, yMax: number): number {
  const plotTop = MARGIN.top;
  const plotBottom = HEIGHT - MARGIN.bottom;
  const t = (accuracy - yMin) / (yMax - yMin || 1);
  return plotBottom - t * (plotBottom - plotTop);
}

/** Nudge label Y positions so nearby scores don't overlap. */
function spreadLabels(
  values: Array<{ id: string; y: number }>,
  minGap: number,
  top: number,
  bottom: number,
): Map<string, number> {
  const sorted = [...values].sort((a, b) => a.y - b.y);
  const ys = sorted.map((item) => item.y);

  for (let i = 1; i < ys.length; i++) {
    if (ys[i]! - ys[i - 1]! < minGap) {
      ys[i] = ys[i - 1]! + minGap;
    }
  }

  let overflow = ys[ys.length - 1]! - bottom;
  if (overflow > 0) {
    for (let i = 0; i < ys.length; i++) ys[i]! -= overflow;
  }

  overflow = top - ys[0]!;
  if (overflow > 0) {
    for (let i = 0; i < ys.length; i++) ys[i]! += overflow;
  }

  // Second pass downward if top push caused collisions again.
  for (let i = 1; i < ys.length; i++) {
    if (ys[i]! - ys[i - 1]! < minGap) {
      ys[i] = ys[i - 1]! + minGap;
    }
  }

  const result = new Map<string, number>();
  sorted.forEach((item, index) => {
    result.set(item.id, ys[index]!);
  });
  return result;
}

export function DiscriminationSlopeChart() {
  const data = DISCRIMINATION_SLOPE_DATA;
  const accuracies = data.flatMap((row) =>
    row.terminalAccuracy == null
      ? [row.tb3Accuracy]
      : [row.terminalAccuracy, row.tb3Accuracy],
  );
  const rawMin = Math.min(...accuracies);
  const rawMax = Math.max(...accuracies);
  const pad = Math.max(4, (rawMax - rawMin) * 0.08);
  const yMin = Math.max(0, rawMin - pad);
  const yMax = Math.min(100, rawMax + pad);

  const leftLabels = data
    .filter((row) => row.terminalAccuracy != null)
    .map((row) => ({
      id: `left-${row.agent}-${row.model}`,
      y: yScale(row.terminalAccuracy!, yMin, yMax),
    }));
  const rightLabels = data.map((row) => ({
    id: `right-${row.agent}-${row.model}`,
    y: yScale(row.tb3Accuracy, yMin, yMax),
  }));

  const leftY = spreadLabels(
    leftLabels,
    MIN_LABEL_GAP,
    MARGIN.top,
    HEIGHT - MARGIN.bottom,
  );
  const rightY = spreadLabels(
    rightLabels,
    MIN_LABEL_GAP,
    MARGIN.top,
    HEIGHT - MARGIN.bottom,
  );

  return (
    <figure className="my-6 not-prose">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Pass rate by model on Terminal-Bench 2.1 vs Terminal-Bench 3.0"
        className="mx-auto block max-w-full"
      >
        <text
          x={WIDTH / 2}
          y={22}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize={11}
        >
          Pass Rate by Model
        </text>

        <text
          x={LEFT_X}
          y={44}
          textAnchor="middle"
          className="fill-foreground font-mono"
          fontSize={13}
        >
          Terminal-Bench 2.1
        </text>
        <text
          x={RIGHT_X}
          y={44}
          textAnchor="middle"
          className="fill-foreground font-mono"
          fontSize={13}
        >
          Terminal-Bench 3.0
        </text>

        <line
          x1={LEFT_X}
          y1={MARGIN.top}
          x2={LEFT_X}
          y2={HEIGHT - MARGIN.bottom}
          className="stroke-border"
          strokeWidth={1.25}
        />
        <line
          x1={RIGHT_X}
          y1={MARGIN.top}
          x2={RIGHT_X}
          y2={HEIGHT - MARGIN.bottom}
          className="stroke-border"
          strokeWidth={1.25}
        />

        {data.map((row) => {
          const leftId = `left-${row.agent}-${row.model}`;
          const rightId = `right-${row.agent}-${row.model}`;
          const fy = yScale(row.tb3Accuracy, yMin, yMax);
          const ty =
            row.terminalAccuracy == null
              ? null
              : yScale(row.terminalAccuracy, yMin, yMax);
          const labelLeftY = leftY.get(leftId) ?? ty ?? fy;
          const labelRightY = rightY.get(rightId) ?? fy;

          return (
            <g key={`${row.agent}-${row.model}`}>
              {ty != null ? (
                <>
                  <line
                    x1={LEFT_X}
                    y1={ty}
                    x2={RIGHT_X}
                    y2={fy}
                    className="stroke-muted-foreground/45"
                    strokeWidth={1.25}
                  />
                  <circle
                    cx={LEFT_X}
                    cy={ty}
                    r={DOT_R}
                    className="fill-foreground"
                  />
                  <text
                    x={LEFT_X - 12}
                    y={labelLeftY}
                    textAnchor="end"
                    dominantBaseline="central"
                    className="fill-foreground font-mono"
                    fontSize={12}
                  >
                    {`${row.model} — ${formatPct(row.terminalAccuracy!)}`}
                  </text>
                </>
              ) : null}

              <circle
                cx={RIGHT_X}
                cy={fy}
                r={DOT_R}
                className="fill-foreground"
              />
              <text
                x={RIGHT_X + 12}
                y={labelRightY}
                textAnchor="start"
                dominantBaseline="central"
                className="fill-foreground font-mono"
                fontSize={12}
              >
                {`${row.model} — ${formatPct(row.tb3Accuracy)}`}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        Discrimination vs Terminal-Bench 2.1
      </figcaption>
    </figure>
  );
}
