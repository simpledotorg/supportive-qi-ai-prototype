import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CURRENT_USER, FACILITIES, type FacilityNote } from "@/data/facilities";
import { DStatGrid } from "@/components/DStatGrid";
import { StatusTag } from "@/components/StatusTag";
import { StockChip } from "@/components/StockChip";
import { InsightCard } from "@/components/InsightCard";
import { Note, SectionLabel } from "@/components/Note";
import { useNotes, useVisited } from "@/hooks/useLocalState";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { loadFacilityTsv, mergeFacilitiesFromTsv } from "@/data/facilityTsv";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatToday(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}

export default function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: tsvRows } = useQuery({
    queryKey: ["facility-tsv"],
    queryFn: loadFacilityTsv,
    staleTime: Infinity,
  });

  const facilities = useMemo(() => mergeFacilitiesFromTsv(FACILITIES, tsvRows ?? []), [tsvRows]);
  const facility = useMemo(() => facilities.find((f) => f.id === id), [facilities, id]);
  const { isVisited, toggleVisited } = useVisited();
  const { getNotes, addNote } = useNotes();
  const [draft, setDraft] = useState("");

  if (!facility) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[420px] p-6">
          <p className="mb-3 text-sm">Facility not found.</p>
          <Link to="/" className="text-sm underline">Back to district summary</Link>
        </div>
      </main>
    );
  }

  const visited = isVisited(facility.id);
  const userNotes = getNotes(facility.id);
  // Combine: pre-baked first (chronological), user-added appended
  const allNotes: FacilityNote[] = [...facility.notes, ...userNotes];

  const stats = [
    { label: "BP control", value: facility.bpControl, delta: facility.bpControlT, goodDir: "up" as const },
    { label: "BP uncontrolled", value: facility.bpUncontrolled, delta: facility.bpUncontrolledT, goodDir: "down" as const },
    { label: "Missed visit", value: facility.missed3m, delta: facility.missed3mT, goodDir: "down" as const },
    { label: "Titration rate", value: facility.titration, delta: facility.titrationT, goodDir: "up" as const },
    { label: "Statin prescription", value: facility.statins, delta: facility.statinsT, goodDir: "up" as const },
    { label: "BP fudging", value: facility.fudging, delta: facility.fudgingT, goodDir: "down" as const },
  ];

  const handleAddNote = () => {
    const body = draft.trim();
    if (!body) return;
    addNote(facility.id, { date: formatToday(), author: CURRENT_USER, body });
    setDraft("");
    toast.success("Note added");
  };

  const handleVisited = () => {
    toggleVisited(facility.id);
    if (!visited) toast.success(`Marked ${facility.name} as visited`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-[420px] animate-in fade-in slide-in-from-right-4 border-x border-border bg-surface px-[18px] pb-20 pt-5 duration-200 sm:my-6 sm:rounded-xl sm:border">
        {/* Header */}
        <div className="mb-[18px] flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-surface text-foreground/70 transition-colors hover:bg-surface-sunken"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex flex-wrap items-center gap-2">
              <span className="text-base font-bold">{facility.name}</span>
              <StatusTag status={facility.status} />
            </div>
            <div className="text-[12px] text-muted-foreground">
              <span className="font-mono tnum">{facility.patients.toLocaleString()}</span> patients
            </div>
          </div>
        </div>

        {/* Detail summary */}
        <ul className="mb-[18px] space-y-0">
          {facility.detailSummary.map((s, idx) => (
            <li
              key={idx}
              className="relative py-[3px] pl-4 text-[13.5px] font-medium leading-[1.55] before:absolute before:left-0 before:top-[11px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-foreground/70"
            >
              {s}
            </li>
          ))}
        </ul>

        {/* Delta-first stat grid */}
        <div className="mb-[14px]">
          <DStatGrid stats={stats} />
        </div>

        {/* Drug stock chip — placed prominently right after stats */}
        <StockChip days={facility.daysStock} />

        {/* Areas of concern */}
        {facility.concerns.length > 0 && (
          <div className="mb-2">
            <SectionLabel>Areas of concern</SectionLabel>
            {facility.concerns.map((c, idx) => (
              <InsightCard key={idx} insight={c} />
            ))}
          </div>
        )}

        {/* Areas of strength */}
        {facility.strengths.length > 0 && (
          <div className="mb-2">
            <SectionLabel>Areas of strength</SectionLabel>
            {facility.strengths.map((c, idx) => (
              <InsightCard key={idx} insight={c} />
            ))}
          </div>
        )}

        {/* Verify */}
        <div className="mb-5 rounded-lg border bg-surface px-3.5 py-3.5">
          <h4 className="mb-2 text-[13.5px] font-bold">Verify on the ground</h4>
          <ul className="space-y-0">
            {facility.verify.map((v, idx) => (
              <li
                key={idx}
                className="relative py-[3px] pl-4 text-[13px] leading-[1.55] text-foreground/80 before:absolute before:left-0 before:top-[10px] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <SectionLabel>Additional notes</SectionLabel>
          {allNotes.length > 0 ? (
            allNotes.map((n, idx) => <Note key={idx} note={n} />)
          ) : (
            <div className="rounded-lg border bg-surface px-3.5 py-3 text-[13px] italic text-muted-foreground">
              No notes yet.
            </div>
          )}

          {/* Add note */}
          <div className="mt-2.5">
            <h4 className="mb-1.5 text-[13px] font-semibold text-foreground/80">Add a note</h4>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add field context or observations. Your name and today's date will be saved with the note."
              className="min-h-[54px] w-full resize-y rounded-md border bg-surface px-3 py-2.5 text-[13px] leading-[1.5] text-foreground/85 outline-none focus:border-strong"
            />
            {draft.trim() && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold transition-colors hover:bg-surface-sunken"
                >
                  Save note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visited */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleVisited}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-[18px] py-2.5 text-[13px] font-semibold transition-colors",
              visited
                ? "bg-good text-good-foreground hover:bg-good-soft-foreground"
                : "bg-foreground text-background hover:bg-foreground/85",
            )}
          >
            {visited ? "Visited \u2713" : "Mark as visited"}
          </button>
        </div>
      </div>
    </main>
  );
}
