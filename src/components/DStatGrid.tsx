import { Sparkline } from "./Sparkline";

export interface DStat {
  label: string;
  value: number;
  delta: number;
  goodDir: "up" | "down";
  /** BP fudging uses a ratio scale from the source sheet; others are %. */
  valueMode?: "percent" | "ratio";
}

interface Props {
  stats: DStat[];
}

function formatDelta(delta: number, mode: "percent" | "ratio"): JSX.Element {
  if (delta === 0) return <span>{mode === "ratio" ? "0" : "0%"}</span>;
  const arrow = delta > 0 ? "▲" : "▼";
  const abs = mode === "ratio" ? Math.abs(delta).toFixed(1).replace(/\.0$/, "") : String(Math.abs(delta));
  const suffix = mode === "ratio" ? "" : "%";
  return (
    <span className="inline-flex items-baseline">
      <span className="inline-flex w-[1em] shrink-0 justify-center text-[0.72em] leading-none">
        <span className="relative -top-[3px]">{arrow}</span>
      </span>
      <span>
        {abs}
        {suffix}
      </span>
    </span>
  );
}

function deltaTone(delta: number, goodDir: "up" | "down"): "good" | "bad" | "flat" {
  if (delta === 0) return "flat";
  const positive = delta > 0;
  const isGood = goodDir === "up" ? positive : !positive;
  return isGood ? "good" : "bad";
}

const TONE_CLS: Record<"good" | "bad" | "flat", string> = {
  good: "text-good",
  bad: "text-bad",
  flat: "text-muted-foreground",
};

/**
 * Delta-first stat tile grid. The big number is the month-over-month delta
 * in %, color-coded by whether it's a good or bad direction. The current
 * value sits underneath in muted text. Sparkline anchors the trend.
 */
export function DStatGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border bg-border">
      {stats.map((s) => {
        const tone = deltaTone(s.delta, s.goodDir);
        const mode = s.valueMode ?? "percent";
        const valueStr =
          mode === "ratio"
            ? Number.isInteger(s.value)
              ? String(s.value)
              : s.value.toFixed(1).replace(/\.0$/, "")
            : `${s.value}`;
        return (
          <div key={s.label} className="bg-surface p-3">
            <div className="mb-1.5 text-[10.5px] font-medium leading-tight text-muted-foreground">
              {s.label}
            </div>
            <div className={`mb-0.5 font-mono text-[20px] font-bold leading-[1.1] tracking-[-0.5px] tnum ${TONE_CLS[tone]}`}>
              {formatDelta(s.delta, mode)}
            </div>
            <div className="mb-2 font-mono text-[11.5px] text-muted-foreground tnum">
              now{" "}
              <strong className="font-semibold text-foreground/80">
                {mode === "ratio" ? valueStr : `${valueStr}%`}
              </strong>
            </div>
            <Sparkline current={s.value} delta={s.delta} goodDir={s.goodDir} />
          </div>
        );
      })}
    </div>
  );
}
