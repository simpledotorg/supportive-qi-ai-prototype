import type { InsightCategory } from "@/data/facilities";
import { cn } from "@/lib/utils";

const CONFIG: Record<InsightCategory, { label: string; cls: string }> = {
  op: { label: "Operational", cls: "cat-op" },
  retention: { label: "Patient retention", cls: "cat-retention" },
  clinical: { label: "Clinical practice", cls: "cat-clinical" },
  supply: { label: "Supply chain", cls: "cat-supply" },
  data: { label: "Data quality", cls: "cat-data" },
  outcomes: { label: "Patient outcomes", cls: "cat-outcomes" },
};

export function CategoryTag({ category, className }: { category: InsightCategory; className?: string }) {
  const cfg = CONFIG[category];
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-[3px] px-1.5 py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.5px]",
        cfg.cls,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}
