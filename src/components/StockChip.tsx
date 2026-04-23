import { cn } from "@/lib/utils";

interface Props {
  days: number;
}

/**
 * Simple inline drug-stock indicator. A small colored dot + label + day count.
 * No heavy chip; reads as a quiet status line under the indicator grid.
 *   ≤15 days   → red (low)
 *   16–45 days → amber (partial)
 *   46+ days   → neutral (ok)
 */
export function StockChip({ days }: Props) {
  let level: "low" | "partial" | "ok";
  if (days <= 15) level = "low";
  else if (days <= 45) level = "partial";
  else level = "ok";

  const dot =
    level === "low"
      ? "bg-bad"
      : level === "partial"
      ? "bg-[hsl(32_85%_45%)]"
      : "bg-muted-foreground/50";

  const valueColor =
    level === "low"
      ? "text-bad"
      : level === "partial"
      ? "text-amber-text"
      : "text-foreground";

  return (
    <div className="mb-6 flex items-baseline gap-2 px-1">
      <span
        className={cn("relative top-[-2px] h-1.5 w-1.5 shrink-0 rounded-full", dot)}
        aria-hidden
      />
      <span className="text-[12px] text-muted-foreground">Drug stock</span>
      <span className={cn("ml-auto font-mono text-[13px] font-semibold tnum", valueColor)}>
        {days} <span className="font-sans font-normal text-muted-foreground">days</span>
      </span>
    </div>
  );
}
