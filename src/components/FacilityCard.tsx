import { Pin, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Facility } from "@/data/facilities";
import { StatusTag } from "./StatusTag";
import { cn } from "@/lib/utils";
import { classifyInsight } from "@/lib/sentiment";

interface Props {
  facility: Facility;
  showDismiss?: boolean;
  pinned: boolean;
  visited: boolean;
  onPin: () => void;
  onDismiss?: () => void;
}

export function FacilityCard({ facility, showDismiss, pinned, visited, onPin, onDismiss }: Props) {
  return (
    <Link
      to={`/facility/${facility.id}`}
      className={cn(
        "relative block rounded-lg border bg-surface p-3.5 transition-colors hover:border-strong",
        pinned && "border-strong",
        visited && "opacity-55",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold leading-tight">{facility.name}</span>
            {pinned && <Pin className="h-3 w-3 text-muted-foreground" fill="currentColor" />}
            {visited && (
              <span className="rounded-[3px] bg-good-soft px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-[0.3px] text-good-soft-foreground">
                Visited
              </span>
            )}
          </div>
          <div className="font-mono text-[11.5px] text-muted-foreground tnum">
            {facility.patients.toLocaleString()} patients
          </div>
        </div>
        <StatusTag status={facility.status} />
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPin();
            }}
            aria-label={pinned ? "Unpin facility" : "Pin facility"}
            aria-pressed={pinned}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded text-muted-foreground/70 transition-colors hover:bg-surface-sunken hover:text-foreground",
              pinned && "text-foreground",
            )}
          >
            <Pin className="h-3.5 w-3.5" fill={pinned ? "currentColor" : "none"} />
          </button>
          {showDismiss && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDismiss?.();
              }}
              aria-label="Remove from list"
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground/70 transition-colors hover:bg-surface-sunken hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <ul className="space-y-0.5">
        {facility.cardInsights.slice(0, 3).map((i, idx) => {
          const sentiment = classifyInsight(i);
          return (
            <li
              key={idx}
              className={cn(
                "relative pl-3.5 text-[12.5px] leading-[1.5] text-foreground/80 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:rounded-full",
                sentiment === "positive" ? "before:bg-good" : "before:bg-bad",
              )}
            >
              {i}
            </li>
          );
        })}
      </ul>
      <ChevronRight className="pointer-events-none absolute bottom-2.5 right-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
    </Link>
  );
}
