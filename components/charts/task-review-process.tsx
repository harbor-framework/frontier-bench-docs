const WIDTH = 720;
const HEIGHT = 280;

const BOX_H = 36;
const BOX_H_TALL = 48;
const MAIN_Y = 116;
const TOP_Y = 24;
const BOTTOM_Y = 208;
const ARROW_GAP = 10;
const FONT_SIZE = 13;

type Point = { x: number; y: number };

type BoxProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  lines: readonly string[];
};

function Box({ x, y, width, height, lines }: BoxProps) {
  const lineHeight = 15;
  const blockHeight = lines.length * lineHeight;
  const startY = y + (height - blockHeight) / 2 + lineHeight * 0.72;

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
        y={startY}
        textAnchor="middle"
        className="fill-background font-mono"
        fontSize={FONT_SIZE}
      >
        {lines.map((line, index) => (
          <tspan key={line} x={x + width / 2} dy={index === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function Arrow({
  from,
  to,
}: {
  from: Point;
  to: Point;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      className="stroke-foreground"
      strokeWidth={1.25}
      markerEnd="url(#task-review-arrow)"
    />
  );
}

/** Left arrow outbound from center; right arrow inbound to center. */
function VerticalPair({
  centerX,
  fromY,
  toY,
}: {
  centerX: number;
  fromY: number;
  toY: number;
}) {
  const leftX = centerX - ARROW_GAP / 2;
  const rightX = centerX + ARROW_GAP / 2;

  return (
    <g>
      <Arrow from={{ x: leftX, y: fromY }} to={{ x: leftX, y: toY }} />
      <Arrow from={{ x: rightX, y: toY }} to={{ x: rightX, y: fromY }} />
    </g>
  );
}

function HorizontalArrow({
  fromX,
  toX,
  y,
}: {
  fromX: number;
  toX: number;
  y: number;
}) {
  return <Arrow from={{ x: fromX, y }} to={{ x: toX, y }} />;
}

export function TaskReviewProcess() {
  const proposal = { x: 36, y: MAIN_Y, w: 96, h: BOX_H };
  const pr = { x: 196, y: MAIN_Y, w: 340, h: BOX_H };
  const merge = { x: 600, y: MAIN_Y, w: 84, h: BOX_H };

  const proposalReviewer = { x: proposal.x, y: TOP_Y, w: proposal.w, h: BOX_H };
  const llmJudge = {
    x: proposal.x,
    y: BOTTOM_Y,
    w: proposal.w,
    h: BOX_H_TALL,
  };

  const topBoxW = 108;
  const prReviewer = {
    x: pr.x + 28,
    y: TOP_Y,
    w: topBoxW,
    h: BOX_H,
  };
  const seniorReviewer = {
    x: pr.x + pr.w - 28 - topBoxW,
    y: TOP_Y,
    w: topBoxW,
    h: BOX_H_TALL,
  };

  const bottomBoxW = 96;
  const bottomSpan = pr.w - 40;
  const bottomStart = pr.x + 20;
  const bottomStep = (bottomSpan - bottomBoxW) / 2;
  const staticChecks = {
    x: bottomStart,
    y: BOTTOM_Y,
    w: bottomBoxW,
    h: BOX_H_TALL,
  };
  const agentJudge = {
    x: bottomStart + bottomStep,
    y: BOTTOM_Y,
    w: bottomBoxW,
    h: BOX_H_TALL,
  };
  const agentTrials = {
    x: bottomStart + bottomStep * 2,
    y: BOTTOM_Y,
    w: bottomBoxW,
    h: BOX_H_TALL,
  };

  const mainMidY = MAIN_Y + BOX_H / 2;

  return (
    <figure className="my-6 not-prose">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Task review process"
        className="mx-auto block max-w-full"
      >
        <defs>
          <marker
            id="task-review-arrow"
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

        <HorizontalArrow
          fromX={proposal.x + proposal.w}
          toX={pr.x}
          y={mainMidY}
        />
        <HorizontalArrow
          fromX={pr.x + pr.w}
          toX={merge.x}
          y={mainMidY}
        />

        <VerticalPair
          centerX={proposal.x + proposal.w / 2}
          fromY={MAIN_Y}
          toY={TOP_Y + BOX_H}
        />
        <VerticalPair
          centerX={proposal.x + proposal.w / 2}
          fromY={MAIN_Y + BOX_H}
          toY={BOTTOM_Y}
        />

        <VerticalPair
          centerX={prReviewer.x + prReviewer.w / 2}
          fromY={MAIN_Y}
          toY={TOP_Y + BOX_H}
        />
        <VerticalPair
          centerX={seniorReviewer.x + seniorReviewer.w / 2}
          fromY={MAIN_Y}
          toY={TOP_Y + BOX_H_TALL}
        />

        <VerticalPair
          centerX={staticChecks.x + staticChecks.w / 2}
          fromY={MAIN_Y + BOX_H}
          toY={BOTTOM_Y}
        />
        <VerticalPair
          centerX={agentJudge.x + agentJudge.w / 2}
          fromY={MAIN_Y + BOX_H}
          toY={BOTTOM_Y}
        />
        <VerticalPair
          centerX={agentTrials.x + agentTrials.w / 2}
          fromY={MAIN_Y + BOX_H}
          toY={BOTTOM_Y}
        />

        <Box
          x={proposalReviewer.x}
          y={proposalReviewer.y}
          width={proposalReviewer.w}
          height={proposalReviewer.h}
          lines={['Reviewer']}
        />
        <Box
          x={proposal.x}
          y={proposal.y}
          width={proposal.w}
          height={proposal.h}
          lines={['Proposal']}
        />
        <Box
          x={llmJudge.x}
          y={llmJudge.y}
          width={llmJudge.w}
          height={llmJudge.h}
          lines={['LLM', 'Judge']}
        />

        <Box
          x={prReviewer.x}
          y={prReviewer.y}
          width={prReviewer.w}
          height={prReviewer.h}
          lines={['Reviewer']}
        />
        <Box
          x={seniorReviewer.x}
          y={seniorReviewer.y}
          width={seniorReviewer.w}
          height={seniorReviewer.h}
          lines={['Senior', 'Reviewer']}
        />
        <Box x={pr.x} y={pr.y} width={pr.w} height={pr.h} lines={['PR']} />
        <Box
          x={staticChecks.x}
          y={staticChecks.y}
          width={staticChecks.w}
          height={staticChecks.h}
          lines={['Static', 'Checks']}
        />
        <Box
          x={agentJudge.x}
          y={agentJudge.y}
          width={agentJudge.w}
          height={agentJudge.h}
          lines={['Agent', 'Judge']}
        />
        <Box
          x={agentTrials.x}
          y={agentTrials.y}
          width={agentTrials.w}
          height={agentTrials.h}
          lines={['Agent', 'Trials']}
        />

        <Box
          x={merge.x}
          y={merge.y}
          width={merge.w}
          height={merge.h}
          lines={['Merge']}
        />
      </svg>
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        Task Review Process
      </figcaption>
    </figure>
  );
}
