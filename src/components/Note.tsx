import type { FacilityNote } from "@/data/facilities";

export function Note({ note }: { note: FacilityNote }) {
  return (
    <div className="mb-2 rounded-lg border bg-surface px-3.5 py-3">
      <div className="mb-1 flex items-baseline gap-2.5 text-[11.5px]">
        <span className="font-mono text-muted-foreground tnum">{note.date}</span>
        <span className="font-semibold text-foreground/80">{note.author}</span>
      </div>
      <p className="text-[13px] leading-[1.55] text-foreground/80">{note.body}</p>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 mt-2 text-[10.5px] font-semibold uppercase tracking-[1.2px] text-muted-foreground/70">
      {children}
    </div>
  );
}
