import type { InsightItem } from "@/data/facilities";
import { CategoryTag } from "./CategoryTag";

export function InsightCard({ insight }: { insight: InsightItem }) {
  return (
    <div className="mb-2.5 overflow-hidden rounded-lg border bg-surface">
      <div className="flex items-start justify-between gap-2.5 border-b px-3.5 py-3">
        <h4 className="min-w-0 flex-1 text-[14px] font-bold leading-[1.35]">{insight.title}</h4>
        <CategoryTag category={insight.category} />
      </div>
      <div className="px-3.5 py-3">
        <p className="mb-2.5 text-[13px] leading-[1.55] text-foreground/80">{insight.summary}</p>
        <div className="mb-1 text-[12px] font-semibold text-foreground/80">Evidence:</div>
        <ul className="space-y-0">
          {insight.evidence.map((e, idx) => (
            <li
              key={idx}
              className="relative py-[2px] pl-3.5 text-[12.5px] leading-[1.5] text-foreground/80 before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/60"
            >
              {e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
