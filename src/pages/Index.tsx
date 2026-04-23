import { useMemo, useState } from "react";
import { DISTRICT, DISTRICT_INSIGHTS, FACILITIES, getNeedsAttention, type FacilityStatus } from "@/data/facilities";
import { DStatGrid } from "@/components/DStatGrid";
import { FacilityCard } from "@/components/FacilityCard";
import { useDismissed, usePinned, useVisited } from "@/hooks/useLocalState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Filter = "all" | FacilityStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "action", label: "Critical" },
  { id: "risk", label: "At risk" },
  { id: "improving", label: "Improving" },
  { id: "target", label: "On target" },
  { id: "top", label: "Top performer" },
  { id: "stagnating", label: "Stagnating" },
];

export default function Index() {
  const pinned = usePinned();
  const dismissed = useDismissed();
  const visited = useVisited();
  const [filter, setFilter] = useState<Filter>("all");

  // Top 3 needs-attention — auto-refills when one is dismissed (always shows up to 3)
  const needsAttention = useMemo(
    () => getNeedsAttention(FACILITIES, dismissed.set, pinned.set, 3),
    [dismissed.set, pinned.set],
  );
  const needsIds = new Set(needsAttention.map((f) => f.id));

  // "All facilities" pool excludes whatever is currently shown in needs-attention
  const countsPool = useMemo(
    () => FACILITIES.filter((f) => !needsIds.has(f.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [needsAttention],
  );
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: countsPool.length, action: 0, risk: 0, target: 0, improving: 0, stagnating: 0, top: 0 };
    for (const f of countsPool) c[f.status]++;
    return c;
  }, [countsPool]);

  const allFacilities = useMemo(() => {
    const list = countsPool.filter((f) => filter === "all" || f.status === filter);
    return [...list].sort((a, b) => {
      const ap = pinned.has(a.id) ? 1 : 0;
      const bp = pinned.has(b.id) ? 1 : 0;
      if (ap !== bp) return bp - ap;
      return a.bpControl - b.bpControl;
    });
  }, [countsPool, filter, pinned]);

  const handleDismiss = (id: string, name: string) => {
    dismissed.add(id);
    toast(`Removed ${name} from priority list`, {
      description: "Still available in All facilities",
      action: {
        label: "Undo",
        onClick: () => dismissed.remove(id),
      },
    });
  };

  return (
    <main className="min-h-screen">
      <div className="min-h-screen w-full">
        {/* Header */}
        <header className="mb-5">
          <h1 className="mb-[3px] text-[20px] font-bold leading-tight tracking-[-0.3px]">
            District summary for April
          </h1>
          <p className="text-[12.5px] leading-[1.4] text-muted-foreground">
            Sylhet District · {DISTRICT.month} · {DISTRICT.facilityCount} facilities ·{" "}
            <span className="font-mono tnum">{DISTRICT.totalPatients.toLocaleString()}</span> patients
          </p>
        </header>

        {/* District stats — delta-first */}
        <div className="mb-5">
          <DStatGrid stats={DISTRICT.stats} />
        </div>

        {/* District insights */}
        <ul className="mb-[18px] space-y-0">
          {DISTRICT_INSIGHTS.map((i, idx) => (
            <li
              key={idx}
              className={cn(
                "relative py-1 pl-4 text-[13px] leading-[1.5] text-foreground/80 before:absolute before:left-0 before:top-[10px] before:h-1.5 before:w-1.5 before:rounded-full",
                i.tone === "bad" ? "before:bg-bad" : "before:bg-good",
              )}
            >
              {i.text}
            </li>
          ))}
        </ul>

        {/* Needs attention */}
        <h2 className="mb-2.5 mt-1 text-[13px] font-bold">Facilities that need attention</h2>
        <div className="mb-5 space-y-2">
          {needsAttention.length > 0 ? (
            needsAttention.map((f) => (
              <FacilityCard
                key={f.id}
                facility={f}
                showDismiss
                pinned={pinned.has(f.id)}
                visited={visited.isVisited(f.id)}
                onPin={() => pinned.toggle(f.id)}
                onDismiss={() => handleDismiss(f.id, f.name)}
              />
            ))
          ) : (
            <div className="rounded-md border bg-surface p-4 text-center text-[13px] text-muted-foreground">
              All clear. No facilities need urgent attention this month.
            </div>
          )}
        </div>

        {/* All facilities */}
        <h2 className="mb-2.5 mt-5 text-[13px] font-bold">All facilities</h2>

        {/* Filter chips */}
        <div className="-mx-[18px] mb-3 px-[18px]">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const count = counts[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-surface text-foreground hover:bg-surface-sunken",
                  )}
                >
                  {f.label}{" "}
                  <span className={cn("font-mono tnum text-[10.5px]", active ? "opacity-80" : "text-muted-foreground")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {allFacilities.length > 0 ? (
            allFacilities.map((f) => (
              <FacilityCard
                key={f.id}
                facility={f}
                pinned={pinned.has(f.id)}
                visited={visited.isVisited(f.id)}
                onPin={() => pinned.toggle(f.id)}
              />
            ))
          ) : (
            <div className="rounded-md border bg-surface p-4 text-center text-[13px] text-muted-foreground">
              No facilities match this filter.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
