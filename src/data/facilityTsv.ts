import type { Facility, FacilityStatus, InsightCategory, InsightItem } from "@/data/facilities";

export type FacilityTsvPatch = {
  facility: string;
  category: string;
  status: FacilityStatus | null;
  cardInsights: string[];
  detailSummary: string[];
  verify: string[];
  concerns: InsightItem[];
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

function splitBullets(text: string): string[] {
  const raw = text.replace(/\u2022/g, "•");
  if (raw.includes("•")) {
    return raw
      .split("•")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (/\b1\.\s/.test(raw)) {
    return raw
      .split(/\b\d+\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return raw.trim() ? [raw.trim()] : [];
}

function mapDomainToInsightCategory(domain: string): InsightCategory {
  switch (norm(domain)) {
    case "clinical":
    case "clinical practice":
      return "clinical";
    case "operational":
    case "operations":
      return "op";
    case "retention":
      return "retention";
    case "supply":
    case "supply chain":
      return "supply";
    case "data":
    case "data quality":
      return "data";
    case "outcomes":
      return "outcomes";
    default:
      return "op";
  }
}

export function parseFacilityTsv(tsvText: string): FacilityTsvPatch[] {
  const lines = tsvText
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  const header = parseTsvLine(lines[0]);
  const idx = (name: string) => header.findIndex((h) => norm(h) === norm(name));

  const facilityI = idx("Facility");
  const categoryI = idx("Category");
  if (facilityI < 0 || categoryI < 0) return [];

  const legacy = {
    districtI: idx("District summary card"),
    i1: idx("Facility Card - Insight 1"),
    i2: idx("Facility Card - Insight 2"),
    i3: idx("Facility Card - Insight 3"),
    v1: idx("Verify on ground 1"),
    v2: idx("Verify on ground 2"),
    v3: idx("Verify on ground 3"),
  };
  const modern = {
    needsI: idx("Facilities that need attention"),
    concernTitleI: idx("Area of concern title"),
    concernInsightI: idx("Area of concern insight"),
    concernEvidenceI: idx("Area of concern evidence"),
    concernDomainI: idx("Area of concern domain"),
    verifyI: idx("Verify on the ground"),
  };

  const isLegacy =
    legacy.districtI >= 0 &&
    legacy.i1 >= 0 &&
    legacy.i2 >= 0 &&
    legacy.i3 >= 0 &&
    legacy.v1 >= 0 &&
    legacy.v2 >= 0 &&
    legacy.v3 >= 0;

  const isModern =
    modern.needsI >= 0 &&
    modern.concernTitleI >= 0 &&
    modern.concernInsightI >= 0 &&
    modern.concernEvidenceI >= 0 &&
    modern.concernDomainI >= 0 &&
    modern.verifyI >= 0;

  if (!isLegacy && !isModern) return [];

  const patches: FacilityTsvPatch[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseTsvLine(line);
    const facility = cols[facilityI] ?? "";
    const category = cols[categoryI] ?? "";
    const status = mapTsvCategoryToStatus(category);

    let cardInsights: string[] = [];
    let detailSummary: string[] = [];
    let verify: string[] = [];
    let concerns: InsightItem[] = [];

    if (isLegacy) {
      detailSummary = splitBullets(cols[legacy.districtI] ?? "");
      cardInsights = [cols[legacy.i1] ?? "", cols[legacy.i2] ?? "", cols[legacy.i3] ?? ""].filter(Boolean);
      verify = [cols[legacy.v1] ?? "", cols[legacy.v2] ?? "", cols[legacy.v3] ?? ""].filter(Boolean);
    } else if (isModern) {
      detailSummary = splitBullets(cols[modern.needsI] ?? "");
      cardInsights = detailSummary.slice(0, 3);
      verify = splitBullets(cols[modern.verifyI] ?? "");

      const title = cols[modern.concernTitleI] ?? "";
      const summary = cols[modern.concernInsightI] ?? "";
      const evidence = splitBullets(cols[modern.concernEvidenceI] ?? "");
      const domain = cols[modern.concernDomainI] ?? "";
      if (title.trim() || summary.trim() || evidence.length) {
        concerns = [
          {
            title: title.trim() || "Area of concern",
            summary: summary.trim(),
            evidence,
            category: mapDomainToInsightCategory(domain),
          },
        ];
      }
    }

    patches.push({
      facility,
      category,
      status,
      cardInsights,
      detailSummary,
      verify,
      concerns,
    });
  }
  return patches.filter((p) => p.facility.trim().length > 0);
}

export async function loadFacilityTsv(): Promise<FacilityTsvPatch[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data.tsv`, { cache: "no-store" });
  if (!res.ok) return [];
  const text = await res.text();
  return parseFacilityTsv(text);
}

export function mergeFacilitiesFromTsv(base: Facility[], patches: FacilityTsvPatch[]): Facility[] {
  if (patches.length === 0) return base;

  const byName = new Map(patches.map((p) => [norm(p.facility), p] as const));
  return base.map((f) => {
    const patch = byName.get(norm(f.name));
    if (!patch) return f;

    return {
      ...f,
      status: patch.status ?? f.status,
      cardInsights: patch.cardInsights.length ? patch.cardInsights : f.cardInsights,
      detailSummary: patch.detailSummary.length ? patch.detailSummary : f.detailSummary,
      verify: patch.verify.length ? patch.verify : f.verify,
      concerns: patch.concerns.length ? patch.concerns : f.concerns,
    };
  });
}

export function restrictFacilitiesToTsv(base: Facility[], patches: FacilityTsvPatch[]): Facility[] {
  if (patches.length === 0) return base;
  const names = new Set(patches.map((p) => norm(p.facility)));
  return base.filter((f) => names.has(norm(f.name)));
}

