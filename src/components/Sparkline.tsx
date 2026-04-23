import { generateSeries, sparkPath, dotTone, type DotTone } from "@/lib/sparkline";

interface Props {
  current: number;
  delta: number;
  goodDir: "up" | "down";
  width?: number;
  height?: number;
  className?: string;
}

const dotClass: Record<DotTone, string> = {
  good: "fill-good",
  bad: "fill-bad",
  flat: "fill-muted-foreground/60",
};

export function Sparkline({ current, delta, goodDir, width = 80, height = 22, className = "" }: Props) {
  const data = generateSeries(current, delta);
  const path = sparkPath(data, width, height);
  const tone = dotTone(delta, goodDir);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const cx = width - 2;
  const cy = 2 + (1 - (data[data.length - 1] - min) / range) * (height - 4);
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`block ${className}`}
      aria-hidden="true"
    >
      <path d={path} fill="none" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={cx} cy={cy} r="2.2" className={dotClass[tone]} />
    </svg>
  );
}
