import type { FacilityStatus } from "@/data/facilities";
import { cn } from "@/lib/utils";

const map: Record<FacilityStatus, { label: string; cls: string }> = {
  action: { label: "Critical", cls: "bg-bad-soft text-bad-soft-foreground" },
  risk: { label: "At risk", cls: "bg-amber-50 text-amber-800 border border-amber-200" },
  target: { label: "On target", cls: "bg-good-soft text-good-soft-foreground" },
  improving: { label: "Improving", cls: "bg-good-soft text-good-soft-foreground" },
  stagnating: { label: "Stagnating", cls: "bg-purple-100 text-purple-800" },
  top: { label: "Top performer", cls: "bg-good-soft text-good-soft-foreground border border-good/40" },
};

export const STATUS_LABEL = (s: FacilityStatus) => map[s].label;

export function StatusTag({ status, className }: { status: FacilityStatus; className?: string }) {
  const cfg = map[status];
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-[3px] px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.3px]",
        cfg.cls,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}
