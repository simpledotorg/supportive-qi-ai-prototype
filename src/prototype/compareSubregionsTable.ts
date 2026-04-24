import { FACILITIES } from "@/data/facilities";
import { loadFacilityTsv, mergeFacilitiesFromTsv, restrictFacilitiesToTsv } from "@/data/facilityTsv";

function fmtInt(n: number): string {
  return Math.round(n).toLocaleString();
}

function fmtPct(n: number): string {
  return `${Math.round(n)}%`;
}

function cell(tag: "td" | "th", text: string, className?: string): HTMLTableCellElement {
  const el = document.createElement(tag);
  el.textContent = text;
  if (className) el.className = className;
  return el;
}

function totalsRow(label: string, facilities: { patients: number; bpControl: number; bpUncontrolled: number; missed3m: number }[]) {
  const patients = facilities.reduce((sum, f) => sum + f.patients, 0);
  const controlled = facilities.reduce((sum, f) => sum + f.patients * (f.bpControl / 100), 0);
  const uncontrolled = facilities.reduce((sum, f) => sum + f.patients * (f.bpUncontrolled / 100), 0);
  const missed = facilities.reduce((sum, f) => sum + f.patients * (f.missed3m / 100), 0);

  const pctControlled = patients > 0 ? (controlled / patients) * 100 : 0;
  const pctUncontrolled = patients > 0 ? (uncontrolled / patients) * 100 : 0;
  const pctMissed = patients > 0 ? (missed / patients) * 100 : 0;

  const tr = document.createElement("tr");
  tr.className = "totals";
  tr.setAttribute("data-sort-method", "none");
  tr.appendChild(cell("th", label, "link"));
  tr.appendChild(cell("td", fmtInt(patients), "number under-care bold"));
  tr.appendChild(cell("td", "—", "number"));
  tr.appendChild(cell("td", fmtInt(controlled), "number"));
  tr.appendChild(cell("td", fmtPct(pctControlled), "bp-controlled bold"));
  tr.appendChild(cell("td", fmtInt(uncontrolled), "number"));
  tr.appendChild(cell("td", fmtPct(pctUncontrolled), "bp-uncontrolled bold"));
  tr.appendChild(cell("td", fmtInt(missed), "number"));
  tr.appendChild(cell("td", fmtPct(pctMissed), "three-month-ltfu bold"));
  return tr;
}

function facilityRow(f: { name: string; patients: number; bpControl: number; bpUncontrolled: number; missed3m: number }) {
  const controlled = f.patients * (f.bpControl / 100);
  const uncontrolled = f.patients * (f.bpUncontrolled / 100);
  const missed = f.patients * (f.missed3m / 100);

  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.className = "link";
  const a = document.createElement("a");
  a.href = "#";
  a.textContent = f.name;
  th.appendChild(a);
  tr.appendChild(th);

  tr.appendChild(cell("td", fmtInt(f.patients), "number under-care bold"));
  tr.appendChild(cell("td", "—", "number"));
  tr.appendChild(cell("td", fmtInt(controlled), "number"));
  tr.appendChild(cell("td", fmtPct(f.bpControl), "bp-controlled bold"));
  tr.appendChild(cell("td", fmtInt(uncontrolled), "number"));
  tr.appendChild(cell("td", fmtPct(f.bpUncontrolled), "bp-uncontrolled bold"));
  tr.appendChild(cell("td", fmtInt(missed), "number"));
  tr.appendChild(cell("td", fmtPct(f.missed3m), "three-month-ltfu bold"));
  return tr;
}

async function main() {
  const table = document.getElementById("table-regions") as HTMLTableElement | null;
  if (!table) return;
  const tbody = table.querySelector("tbody");
  if (!tbody) return;

  const patches = await loadFacilityTsv().catch(() => []);
  const merged = mergeFacilitiesFromTsv(FACILITIES, patches ?? []);
  const facilities = restrictFacilitiesToTsv(merged, patches ?? []);

  const rows = [...facilities].sort((a, b) => a.name.localeCompare(b.name));

  tbody.innerHTML = "";
  tbody.appendChild(
    totalsRow("River District", rows.map((f) => ({ patients: f.patients, bpControl: f.bpControl, bpUncontrolled: f.bpUncontrolled, missed3m: f.missed3m }))),
  );

  for (const f of rows) {
    tbody.appendChild(facilityRow(f));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void main();
  });
} else {
  void main();
}

