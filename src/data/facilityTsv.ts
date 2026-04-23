import type { Facility, FacilityStatus } from "@/data/facilities";

export type FacilityTsvRow = {
  facility: string;
  category: string;
  districtSummaryCard: string;
  facilityCardInsight1: string;
  facilityCardInsight2: string;
  facilityCardInsight3: string;
  verify1: string;
  verify2: string;
  verify3: string;
};

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

export function mapTsvCategoryToStatus(category: string): FacilityStatus | null {
  switch (norm(category)) {
    case "critical":
      return "action";
    case "at risk":
      return "risk";
    case "on target":
      return "target";
    case "improving":
      return "improving";
    case "stagnating":
      return "stagnating";
    default:
      return null;
  }
}

function parseTsvLine(line: string): string[] {
  // TSV in this project has no quoted fields; split on tabs.
  return line.split("\t").map((v) => v.trim());
}

export function parseFacilityTsv(tsvText: string): FacilityTsvRow[] {
  const lines = tsvText
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  const header = parseTsvLine(lines[0]);
  const idx = (name: string) => header.findIndex((h) => norm(h) === norm(name));

  // Header expected (first column is "#", which we ignore)
  const facilityI = idx("Facility");
  const categoryI = idx("Category");
  const districtI = idx("District summary card");
  const i1 = idx("Facility Card - Insight 1");
  const i2 = idx("Facility Card - Insight 2");
  const i3 = idx("Facility Card - Insight 3");
  const v1 = idx("Verify on ground 1");
  const v2 = idx("Verify on ground 2");
  const v3 = idx("Verify on ground 3");

  const required = [facilityI, categoryI, districtI, i1, i2, i3, v1, v2, v3];
  if (required.some((i) => i < 0)) return [];

  const rows: FacilityTsvRow[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseTsvLine(line);
    rows.push({
      facility: cols[facilityI] ?? "",
      category: cols[categoryI] ?? "",
      districtSummaryCard: cols[districtI] ?? "",
      facilityCardInsight1: cols[i1] ?? "",
      facilityCardInsight2: cols[i2] ?? "",
      facilityCardInsight3: cols[i3] ?? "",
      verify1: cols[v1] ?? "",
      verify2: cols[v2] ?? "",
      verify3: cols[v3] ?? "",
    });
  }
  return rows.filter((r) => r.facility.trim().length > 0);
}

export async function loadFacilityTsv(): Promise<FacilityTsvRow[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data.tsv`, { cache: "no-store" });
  if (!res.ok) return [];
  const text = await res.text();
  return parseFacilityTsv(text);
}

export function mergeFacilitiesFromTsv(base: Facility[], rows: FacilityTsvRow[]): Facility[] {
  if (rows.length === 0) return base;

  const byName = new Map(rows.map((r) => [norm(r.facility), r] as const));

  return base.map((f) => {
    const row = byName.get(norm(f.name));
    if (!row) return f;

    const status = mapTsvCategoryToStatus(row.category);
    const cardInsights = [row.facilityCardInsight1, row.facilityCardInsight2, row.facilityCardInsight3].filter(Boolean);
    const verify = [row.verify1, row.verify2, row.verify3].filter(Boolean);
    const detailSummary = [row.districtSummaryCard].filter(Boolean);

    return {
      ...f,
      status: status ?? f.status,
      cardInsights: cardInsights.length ? cardInsights : f.cardInsights,
      detailSummary: detailSummary.length ? detailSummary : f.detailSummary,
      verify: verify.length ? verify : f.verify,
    };
  });
}

