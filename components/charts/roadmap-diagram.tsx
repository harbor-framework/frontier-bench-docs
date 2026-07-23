const WIDTH = 720;
const HEIGHT = 360;
const FONT_SIZE = 13;

/** Simplified GitHub mark (Octocat) for the roadmap diagram. */
function GitHubMark({
  cx,
  cy,
  r,
}: {
  cx: number;
  cy: number;
  r: number;
}) {
  const scale = (r * 2) / 98;
  return (
    <g transform={`translate(${cx - r} ${cy - r}) scale(${scale})`}>
      <circle cx={49} cy={49} r={49} className="fill-foreground" />
      <path
        className="fill-background"
        d="M49 20c-16 0-29 13-29 29 0 12.8 8.3 23.7 19.8 27.5 1.4.3 2-.6 2-1.4 0-.7 0-2.5-.1-4.9-8.1 1.8-9.8-3.9-9.8-3.9-1.3-3.4-3.2-4.3-3.2-4.3-2.6-1.8.2-1.8.2-1.8 2.9.2 4.4 3 4.4 3 2.6 4.4 6.8 3.1 8.4 2.4.3-1.9 1-3.1 1.8-3.8-6.4-.7-13.2-3.2-13.2-14.3 0-3.2 1.1-5.7 3-7.8-.3-.7-1.3-3.7.3-7.7 0 0 2.4-.8 8 3 2.3-.6 4.8-1 7.3-1s5 .3 7.3 1c5.5-3.8 8-3 8-3 1.6 4 .6 7 .3 7.7 1.9 2.1 3 4.6 3 7.8 0 11.1-6.8 13.5-13.3 14.2 1 0.9 2 2.6 2 5.3 0 3.8-.1 6.9-.1 7.8 0 .8.5 1.7 2 1.4C69.7 72.7 78 61.8 78 49c0-16-13-29-29-29z"
      />
    </g>
  );
}

function LabeledBox({
  x,
  y,
  width,
  height,
  label,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className="fill-foreground stroke-foreground"
        strokeWidth={1.25}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-background font-mono"
        fontSize={FONT_SIZE}
      >
        {label}
      </text>
    </g>
  );
}

const CHART_BAR_BASE = 64;
const CHART_TALLEST = 52;
const CHART_WIDTH = 70;

function BarChartIcon({ x, y }: { x: number; y: number }) {
  const bars = [
    { bx: 8, h: CHART_TALLEST },
    { bx: 28, h: 38 },
    { bx: 48, h: 24 },
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      {bars.map((bar) => (
        <rect
          key={bar.bx}
          x={bar.bx}
          y={CHART_BAR_BASE - bar.h}
          width={14}
          height={bar.h}
          className="fill-foreground stroke-foreground"
          strokeWidth={1.5}
        />
      ))}
    </g>
  );
}

function WarningIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M18 4 L34 30 L2 30 Z"
        className="fill-foreground stroke-foreground"
        strokeWidth={1.5}
        strokeLinejoin="miter"
      />
      <text
        x={18}
        y={24}
        textAnchor="middle"
        className="fill-background font-mono"
        fontSize={14}
        fontWeight={600}
      >
        !
      </text>
    </g>
  );
}

export function RoadmapDiagram() {
  const builders = { x: 48, y: 28, w: 168, h: 36 };
  const users = { x: 340, y: 28, w: 168, h: 36 };

  const github = { cx: 132, cy: 168, r: 36 };
  const harbor = { x: 300, y: 136, size: 72 };
  const chart = { x: 520, y: 118 };
  const loopY = 292;

  const harborCx = harbor.x + harbor.size / 2;
  const chartCx = chart.x + CHART_WIDTH / 2;
  const chartTop = chart.y + (CHART_BAR_BASE - CHART_TALLEST);
  const chartBase = chart.y + CHART_BAR_BASE;
  const chartVersionY = chartBase + 22;
  const loopStartY = chartVersionY + 10;
  const mainY = github.cy;

  return (
    <figure className="my-6 not-prose">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Harbor roadmap: builders contribute on GitHub, users run Harbor, issues feed back"
        className="mx-auto block max-w-full"
      >
        <defs>
          <marker
            id="roadmap-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground" />
          </marker>
        </defs>

        {/* builders → github */}
        <line
          x1={builders.x + builders.w / 2}
          y1={builders.y + builders.h}
          x2={github.cx}
          y2={github.cy - github.r}
          className="stroke-foreground"
          strokeWidth={1.25}
          markerEnd="url(#roadmap-arrow)"
        />

        {/* users → harbor (down-left) */}
        <path
          d={`M ${users.x + 28} ${users.y + users.h}
              V ${harbor.y - 12}
              H ${harborCx}
              V ${harbor.y}`}
          fill="none"
          className="stroke-foreground"
          strokeWidth={1.25}
          markerEnd="url(#roadmap-arrow)"
        />

        {/* users → chart (down, then right, then down into chart top) */}
        <path
          d={`M ${users.x + users.w - 28} ${users.y + users.h}
              V ${chartTop - 20}
              H ${chartCx}
              V ${chartTop}`}
          fill="none"
          className="stroke-foreground"
          strokeWidth={1.25}
          markerEnd="url(#roadmap-arrow)"
        />

        {/* github → harbor */}
        <line
          x1={github.cx + github.r}
          y1={mainY}
          x2={harbor.x}
          y2={mainY}
          className="stroke-foreground"
          strokeWidth={1.25}
          markerEnd="url(#roadmap-arrow)"
        />

        {/* harbor → chart */}
        <line
          x1={harbor.x + harbor.size}
          y1={mainY}
          x2={chart.x + 4}
          y2={mainY}
          className="stroke-foreground"
          strokeWidth={1.25}
          markerEnd="url(#roadmap-arrow)"
        />

        {/* issues feedback loop: chart → github */}
        <path
          d={`M ${chartCx} ${loopStartY}
              V ${loopY}
              H ${github.cx}
              V ${github.cy + github.r}`}
          fill="none"
          className="stroke-foreground"
          strokeWidth={1.25}
          markerEnd="url(#roadmap-arrow)"
        />

        <LabeledBox
          x={builders.x}
          y={builders.y}
          width={builders.w}
          height={builders.h}
          label="Benchmark Builders"
        />
        <LabeledBox
          x={users.x}
          y={users.y}
          width={users.w}
          height={users.h}
          label="Benchmark Users"
        />

        <GitHubMark cx={github.cx} cy={github.cy} r={github.r} />

        <rect
          x={harbor.x}
          y={harbor.y}
          width={harbor.size}
          height={harbor.size}
          className="fill-foreground"
        />
        <text
          x={harborCx}
          y={harbor.y + harbor.size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-background font-mono"
          fontSize={FONT_SIZE}
        >
          Harbor
        </text>
        <text
          x={harborCx}
          y={harbor.y + harbor.size + 18}
          textAnchor="middle"
          className="fill-foreground font-mono"
          fontSize={12}
        >
          v1.1.0
        </text>

        <BarChartIcon x={chart.x} y={chart.y} />
        <text
          x={chartCx}
          y={chartVersionY}
          textAnchor="middle"
          className="fill-foreground font-mono"
          fontSize={12}
        >
          v1.1.0
        </text>

        {/* Cover the loop line behind the warning so the icon reads cleanly. */}
        <rect
          x={WIDTH / 2 - 28}
          y={loopY - 2}
          width={56}
          height={4}
          className="fill-background"
        />
        <WarningIcon x={WIDTH / 2 - 18} y={loopY - 22} />
        <text
          x={WIDTH / 2}
          y={loopY + 28}
          textAnchor="middle"
          className="fill-foreground font-mono"
          fontSize={FONT_SIZE}
        >
          Issues
        </text>
      </svg>
    </figure>
  );
}
