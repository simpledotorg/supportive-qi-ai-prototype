// Facility data ported from district_summary_mobile_v3.html (source of truth).
// All facilities, with names, patient counts, indicator values, deltas,
// concerns/strengths with category tags, notes, drug stock, etc.

export type FacilityStatus =
  | "action"
  | "risk"
  | "target"
  | "stagnating"
  | "improving"
  | "top";

export type DrugStock = "low" | "partial" | "full";

export type InsightCategory =
  | "op"
  | "retention"
  | "clinical"
  | "supply"
  | "data"
  | "outcomes";

export interface InsightItem {
  title: string;
  category: InsightCategory;
  summary: string;
  evidence: string[];
}

export interface FacilityNote {
  date: string; // dd-MMM-yyyy
  author: string;
  body: string;
}

export interface Facility {
  id: string;
  name: string;
  patients: number;
  // Current values (percentages) and per-month deltas in pp
  bpControl: number;
  bpControlT: number;
  bpUncontrolled: number;
  bpUncontrolledT: number;
  missed3m: number;
  missed3mT: number;
  missed12m: number;
  titration: number;
  titrationT: number;
  statins: number;
  statinsT: number;
  fudging: number;
  fudgingT: number;
  drugStock: DrugStock;
  daysStock: number;
  status: FacilityStatus;
  monthsFlagged: number;
  isNew: boolean;

  cardInsights: string[];
  detailSummary: string[];
  concerns: InsightItem[];
  strengths: InsightItem[];
  verify: string[];
  notes: FacilityNote[];
}

// Current logged-in user (for new notes the manager adds in the field)
export const CURRENT_USER = "Dr Jhali";

// District-level current numbers from the HTML
export const DISTRICT = {
  month: "April 2026",
  facilityCount: 47,
  totalPatients: 42937,
  bpGoal: 63,
  // Stat tiles in the order shown in the HTML — delta-first hierarchy
  stats: [
    { key: "bpControl", label: "BP control", value: 54, delta: -2, goodDir: "up" as const },
    { key: "bpUncontrolled", label: "BP uncontrolled", value: 17, delta: 1, goodDir: "down" as const },
    { key: "missed", label: "Missed visit", value: 31, delta: 1, goodDir: "down" as const },
    { key: "titration", label: "Titration rate", value: 36, delta: -1, goodDir: "up" as const },
    { key: "statins", label: "Statin prescription", value: 48, delta: 1, goodDir: "up" as const },
    { key: "fudging", label: "BP fudging", value: 8, delta: 0, goodDir: "down" as const },
  ],
};

export const DISTRICT_INSIGHTS: { tone: "bad" | "good"; text: string }[] = [
  { tone: "bad", text: "BP control has dropped for 3 months in a row. The main reasons look like low titration (36%) and missed visits (31%)." },
  { tone: "bad", text: "6 facilities need action this month. 2 of them are new problems." },
  { tone: "bad", text: "Drug stock is low at 3 facilities. Kacuya Bohor has been low for 4 months." },
  { tone: "good", text: "Overdue patient calls have doubled. About 1,000 patients came back to care last month." },
  { tone: "good", text: "5 facilities improved by 2 points or more. Gungadiya and Paton gained 6 points each." },
];

const idOf = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Seed = Omit<Facility, "id">;

const seeds: Seed[] = [
  { name: "CC Osmaninagar", patients: 1442, bpControl: 59, bpControlT: 6, bpUncontrolled: 28, bpUncontrolledT: -4, missed3m: 15, missed3mT: -1, missed12m: 14, titration: 83, titrationT: 1, statins: 81, statinsT: 3, fudging: 2.3, fudgingT: -0.2, drugStock: "full", daysStock: 88, status: "action", monthsFlagged: 3, isNew: false,
    cardInsights: ["BP control is the lowest in the district at 37%.", "Fudging is very high (18%). Real BP control may be even lower.", "Medicines are not being adjusted for patients with high BP."],
    detailSummary: ["Flagged for 3 months. Same issues keep appearing.", "Titration dropped to 22%. Fewer than 1 in 4 patients get their medicine adjusted."],
    concerns: [
      { title: "BP data may not be reliable", category: "data", summary: "Fudging rose from 16% to 18% over 3 months. The 37% BP control figure likely overstates the real number.", evidence: ["Fudging up 2 pp this month to 18%", "Fudging has risen 3 months in a row", "BP readings cluster around 130/80 — a common sign of fudging"] },
      { title: "Medicines are not being adjusted", category: "clinical", summary: "Titration dropped 3 points to 22%. Even when patients come in with high BP, their prescriptions are not changing.", evidence: ["Titration at 22%, down 3 pp this month", "38% of patients with high BP had no medicine change in 2 visits", "Uncontrolled BP rate up 3 pp to 42%"] },
      { title: "Previous interventions have not worked", category: "op", summary: "Same issues flagged in Feb and Mar. Whatever was tried did not move the numbers. Time for a different approach.", evidence: ["Flagged 3 months in a row", "BP control has declined each of the past 3 months", "Titration has dropped each month"] },
    ],
    strengths: [],
    verify: ["Audit 20 BP readings from the past week. Look for clustering around 130/80.", "Sample 10–15 patients with high BP. Check if medicines were changed at the last visit.", "Consider on-site mentoring or a supervisory visit."],
    notes: [
      { date: "15-Feb-2026", author: "Dr Rhati", body: "Met with facility in-charge. Reported difficulty with titration protocol. Referred to training module." },
      { date: "12-Mar-2026", author: "Dr Rhati", body: "Follow-up visit. Training completed but titration rate has not improved. Need to check if barriers are clinical knowledge or confidence." },
      { date: "05-Apr-2026", author: "Dr Sumara", body: "Junior doctor rotating out next month. May need to retrain the replacement." },
    ],
  },
  { name: "UHC Fenchuganj", patients: 1313, bpControl: 38, bpControlT: 15, bpUncontrolled: 38, bpUncontrolledT: 6, missed3m: 24, missed3mT: -10, missed12m: 12, titration: 59, titrationT: 15, statins: 34, statinsT: 11, fudging: 2.8, fudgingT: 0.3, drugStock: "full", daysStock: 115, status: "action", monthsFlagged: 2, isNew: false,
    cardInsights: ["BP control is 38%. Many patients are not returning — 35% missed their last visit.", "Medicines are only adjusted for 1 in 4 patients with high BP.", "Drug stock is partial. Fudging is high at 15%."],
    detailSummary: ["Patients are cycling in and out without treatment changes.", "Drug stock is partial. Only 1 in 4 patients with high BP get medicine changes."],
    concerns: [
      { title: "Many patients are missing visits", category: "retention", summary: "35% of patients did not come to the facility in the last 3 months. When patients stop coming, BP control cannot improve.", evidence: ["Missed visits at 35%, up 1 pp", "Only 28% of overdue patients received calls last month", "Uncontrolled BP rate rose 2 pp to 40%"] },
      { title: "Drug stock is partial", category: "supply", summary: "Key medicines are running short. This may be pushing patients away and limiting titration.", evidence: ["Drug stock marked partial for 2 months", "Patient visits dropped 8% since stock issues began", "Missed visits peaked during low-stock weeks"] },
      { title: "BP numbers may be inflated", category: "data", summary: "Fudging rose to 15%. The 38% BP control figure is probably higher than reality.", evidence: ["Fudging at 15%, up 1 pp", "Weekly audits show clustering near 130/80"] },
    ],
    strengths: [],
    verify: ["Check the drug stock register. Which medicines are out?", "Check the call log. What percent of overdue patients were called?", "Sample 10–15 patients with high BP. Were their medicines adjusted?"],
    notes: [
      { date: "22-Mar-2026", author: "Dr Rhati", body: "Pharmacy reports Amlodipine 5mg out of stock for 6 weeks. Requisition submitted to district store on 5-Mar, still pending." },
    ],
  },
  { name: "CC Kacuya Bohor", patients: 153, bpControl: 39, bpControlT: 15, bpUncontrolled: 23, bpUncontrolledT: 15, missed3m: 38, missed3mT: -13, missed12m: 11, titration: 41, titrationT: 10, statins: 59, statinsT: 1, fudging: 3.4, fudgingT: -0.3, drugStock: "full", daysStock: 119, status: "stagnating", monthsFlagged: 4, isNew: false,
    cardInsights: ["Drug stock has been low for 4 months.", "Patients are not coming because there are no medicines to collect.", "Previous flags have not led to a fix."],
    detailSummary: ["Drug stock has been low or partial since January.", "BP control has stayed below 45% for 4 months. Patients are not coming."],
    concerns: [
      { title: "No drug stock for treatment continuity", category: "supply", summary: "Stock has been low for 4 months. Without medicines, patients stop coming and BP cannot be controlled. This is blocking everything else.", evidence: ["Drug stock low since January", "Missed visits rose 6 pp over 4 months", "Statin prescription at 30%, below target"] },
      { title: "4 months of flags, nothing has changed", category: "op", summary: "The same issue has been raised for 4 months. Earlier steps have not fixed the supply. Escalate to district supply chain directly.", evidence: ["Flagged for 4 consecutive months", "BP control has stayed below 45% since January", "Multiple requisitions submitted with no delivery"] },
    ],
    strengths: [],
    verify: ["Confirm the next drug delivery date in writing.", "Find out if patients are being referred to other facilities.", "Make a list of eligible patients who should be on statins but are not."],
    notes: [
      { date: "18-Jan-2026", author: "Dr Rhati", body: "Supply chain issue confirmed — district warehouse has been delayed since January. Escalated to district supply officer." },
      { date: "10-Feb-2026", author: "Dr Sumara", body: "Patients being told to come back in 2 weeks. Some are travelling 30+ km to Fenchuganj to get medicines." },
      { date: "03-Apr-2026", author: "Dr Rhati", body: "Follow-up with district store. Delivery expected by end of April. Need to plan catch-up clinic once stock arrives." },
    ],
  },
  { name: "CC Chhatrish", patients: 263, bpControl: 54, bpControlT: 9, bpUncontrolled: 31, bpUncontrolledT: -2, missed3m: 18, missed3mT: -5, missed12m: 10, titration: 95, titrationT: 5, statins: 82, statinsT: 6, fudging: 1.2, fudgingT: 0, drugStock: "full", daysStock: 88, status: "action", monthsFlagged: 1, isNew: true,
    cardInsights: ["BP control dropped sharply — 5 points in one month.", "Drug stock is full, so medicines are not the problem.", "Something changed this month. Needs a visit to find out what.", "This is a new problem — first time being flagged."],
    detailSummary: ["BP control fell 5 points this month. This is a sudden change from a stable facility.", "Drug stock is full. The problem is likely clinical or staffing."],
    concerns: [
      { title: "Biggest single-month drop in the district", category: "outcomes", summary: "This facility was stable around 50% BP control for 6 months. Then it fell to 40% this month. Big change. Urgent attention needed.", evidence: ["BP control down 5 pp in 1 month", "Prior 6-month average was 50%", "Uncontrolled BP rose 3 pp to 36%"] },
      { title: "Possible staffing or process change", category: "op", summary: "Full drug stock rules out supply. Something changed — new staff, equipment issue, or a shift in clinical routine.", evidence: ["Drug stock is full", "Titration dropped 2 pp to 30%", "Missed visit rate unchanged — patients are still coming"] },
    ],
    strengths: [],
    verify: ["Visit this week. Find out what changed — new medical officer, equipment, staff.", "Sample 15 patients with high BP. Were their medicines adjusted?", "Check if a big group of new patients was registered this month."],
    notes: [
      { date: "20-Apr-2026", author: "Dr Rhati", body: "First-time flag. No previous issues at this facility. Adding to priority visit list for this week." },
    ],
  },
  { name: "CC Baraigram", patients: 123, bpControl: 62, bpControlT: 7, bpUncontrolled: 23, bpUncontrolledT: -3, missed3m: 19, missed3mT: -7, missed12m: 9, titration: 95, titrationT: 6, statins: 91, statinsT: 9, fudging: 2.3, fudgingT: 0, drugStock: "full", daysStock: 82, status: "action", monthsFlagged: 2, isNew: false,
    cardInsights: ["BP control is 41%. Main problem is partial drug stock.", "Fudging is low (6%), so numbers are real.", "Could improve quickly if drug supply is steady."],
    detailSummary: ["Drug supply is not steady. When stock is partial, BP control drops.", "Other indicators are fine. Steady medicines should fix this."],
    concerns: [
      { title: "Drug stock is the main issue", category: "supply", summary: "Stock has been partial for 2 months. Other indicators — titration, fudging, missed visits — are all acceptable. This is a supply problem.", evidence: ["Drug stock partial for 2 months", "Fudging at 6% — data is reliable", "Titration at 32%, slightly improving"] },
    ],
    strengths: [],
    verify: ["Confirm the next drug delivery and how long the supply will last.", "Track stock weekly for the next 2 months. If supply is steady, BP control should rise."],
    notes: [
      { date: "02-Feb-2026", author: "Dr Amrita", body: "Pharmacy shelf check: Losartan 50mg low; amlodipine available. Team is dispensing 2-week refills to stretch stock." },
      { date: "19-Mar-2026", author: "Dr Rhati", body: "Discussed stock reorder cadence with in-charge. Request raised to district store; advised to align requisition with patient run-rate." },
    ],
  },
  { name: "CC Lamagangapur", patients: 179, bpControl: 41, bpControlT: 2, bpUncontrolled: 23, bpUncontrolledT: 5, missed3m: 36, missed3mT: -9, missed12m: 11, titration: 64, titrationT: 15, statins: 37, statinsT: 0, fudging: 3.1, fudgingT: -0.2, drugStock: "low", daysStock: 12, status: "action", monthsFlagged: 2, isNew: false,
    cardInsights: ["Medicines are only adjusted for 1 in 4 patients.", "Drug stock is partial. Patients are not coming back.", "33% missed visits — high for this size."],
    detailSummary: ["Medicines are only adjusted for 1 in 4 patients with high BP.", "Drug stock is partial. Missed visits at 33%."],
    concerns: [
      { title: "Low titration and partial stock reinforce each other", category: "clinical", summary: "When drug stock is not steady, doctors often do not change prescriptions. Fixing stock is likely to lift titration too.", evidence: ["Titration at 26%, down 1 pp", "Drug stock partial", "Missed visits at 33%"] },
    ],
    strengths: [],
    verify: ["Find out which medicines are out of stock.", "Check whether overdue patients are being called.", "Ask medical officers if they change prescriptions when patients have symptoms."],
    notes: [
      { date: "11-Feb-2026", author: "Dr Amrita", body: "Checked dispensing records: patients often receive partial refills when stock is tight. Suggested aligning refill duration with expected delivery dates." },
      { date: "04-Apr-2026", author: "Dr Sumara", body: "Observed MO hesitant to titrate when only one drug available. Recommended documenting alternative regimen options for common stock-out scenarios." },
      { date: "14-Apr-2026", author: "Dr Rhati", body: "Reviewed overdue line list with staff; agreed to prioritize calls for uncontrolled patients first and track outcomes weekly." },
    ],
  },
  { name: "CC Danaram", patients: 167, bpControl: 43, bpControlT: 8, bpUncontrolled: 32, bpUncontrolledT: -15, missed3m: 25, missed3mT: -6, missed12m: 8, titration: 45, titrationT: 12, statins: 36, statinsT: 3, fudging: 5.3, fudgingT: 0.2, drugStock: "partial", daysStock: 37, status: "risk", monthsFlagged: 0, isNew: false,
    cardInsights: ["BP control is 43%, but patients are coming in.", "Drug stock is full and fudging is low.", "Medicines are not being adjusted. This is a clinical practice issue."],
    detailSummary: ["Patients are showing up but BP is not improving.", "Drug stock is full and data is reliable. Issue is clinical practice."],
    concerns: [
      { title: "Treatment inertia — visits without changes", category: "clinical", summary: "Retention is in the top 10 for the district at 25% missed visits. But BP control is stuck at 43%. Patients are coming in but not getting treatment changes.", evidence: ["Missed visits at 25% — above average retention", "BP control flat at 43%", "Titration at 35%, slightly improving"] },
    ],
    strengths: [
      { title: "Strong patient retention", category: "retention", summary: "Missed visit rate is among the best in the district. Patients are engaged with the facility.", evidence: ["Missed visits at 25%, down 1 pp", "Top 10 facility for retention", "Follow-up calls made consistently"] },
    ],
    verify: ["Sample 10 patients with high BP at the last 2 visits. Were medicines changed?", "Talk to the medical officer about when they adjust medicines."],
    notes: [
      { date: "07-Feb-2026", author: "Dr Sumara", body: "Observed clinic flow: BP measured quickly during peak hours. Suggested re-check protocol for borderline high readings before clinician review." },
      { date: "28-Mar-2026", author: "Dr Amrita", body: "Chart sample (n=12) showed limited dose escalation. Shared titration pocket card with MO and agreed to review uncontrolled list weekly." },
    ],
  },
  { name: "CC Shah Arpin", patients: 106, bpControl: 66, bpControlT: 7, bpUncontrolled: 24, bpUncontrolledT: -3, missed3m: 17, missed3mT: -6, missed12m: 10, titration: 81, titrationT: 1, statins: 82, statinsT: 3, fudging: 1.6, fudgingT: -0.2, drugStock: "full", daysStock: 100, status: "risk", monthsFlagged: 0, isNew: false,
    cardInsights: ["BP control is 43% even though drug stock is full.", "Small facility (106 patients). A full chart review is possible.", "Medicines may not be getting adjusted enough."],
    detailSummary: ["Drug stock is full but BP control is low.", "With only 106 patients, a full chart review is practical."],
    concerns: [
      { title: "Treatment inertia is the likely cause", category: "clinical", summary: "Full drug stock and low fudging rule out supply and data issues. Most likely cause is that medicines are not being adjusted for patients with high BP.", evidence: ["Drug stock is full", "Fudging at 7% — data is reliable", "BP control dropped 2 pp to 43%"] },
    ],
    strengths: [],
    verify: ["Review the charts of all patients with uncontrolled BP — possible at this size.", "Check if the medical officer is confident adjusting medicines. They may need support."],
    notes: [],
  },
  { name: "Sylhet Sadar", patients: 5252, bpControl: 56, bpControlT: 8, bpUncontrolled: 37, bpUncontrolledT: -6, missed3m: 15, missed3mT: -1, missed12m: 11, titration: 93, titrationT: 6, statins: 90, statinsT: 8, fudging: 1.4, fudgingT: -0.1, drugStock: "full", daysStock: 69, status: "risk", monthsFlagged: 0, isNew: false,
    cardInsights: ["Largest facility — 5,252 patients.", "A 5-point improvement here means 260 more patients controlled.", "Fudging at 12% means about 630 readings may not be accurate."],
    detailSummary: ["Largest facility in the district — 5,252 patients.", "A 5-point improvement here would mean 260 more patients controlled."],
    concerns: [
      { title: "Possible staffing disruption", category: "op", summary: "Core data entry seems reduced compared to previous month. Large facility may be stretched thin.", evidence: ["Recorded visits dropped 30% vs previous quarter", "No overdue patient calls made this month", "Data entry volume below normal"] },
      { title: "Fudging is high at scale", category: "data", summary: "At this facility size, 12% fudging means around 630 readings may not be accurate. Review measurement practice.", evidence: ["Fudging at 12%", "~630 readings potentially affected", "Clustering pattern seen in spot checks"] },
      { title: "Scale makes this high-impact", category: "outcomes", summary: "Any change at this facility moves the district average. A focused effort here is worth more than the same effort at a small facility.", evidence: ["5,252 patients — 12% of district total", "5 pp improvement = 260 more controlled patients", "Currently 9 pp below district target"] },
    ],
    strengths: [],
    verify: ["Observe BP measurement during a normal clinic. Is the method correct?", "Check staffing. Is the workload causing shortcuts?", "Sample 30 recent BP readings and look for clustering around 130/80."],
    notes: [
      { date: "13-Apr-2026", author: "Dr Sumara", body: "Key data entry staff on maternity leave past 2 months, not returning until August. Temp staff cover required." },
      { date: "20-Apr-2026", author: "Dr Rhati", body: "New data entry person hired and starting 1st May." },
    ],
  },
  { name: "UHC Bishwanath", patients: 3195, bpControl: 46, bpControlT: 0, bpUncontrolled: 32, bpUncontrolledT: 0, missed3m: 22, missed3mT: 0, missed12m: 10, titration: 41, titrationT: 0, statins: 42, statinsT: 0, fudging: 3.7, fudgingT: 0, drugStock: "partial", daysStock: 32, status: "risk", monthsFlagged: 0, isNew: false,
    cardInsights: ["Second largest facility — 3,195 patients.", "Drug stock is full, but titration flat at 36% for 4 months.", "Fudging at 10% should be watched."],
    detailSummary: ["Second largest facility — 3,195 patients.", "Titration has been flat at 36% for 4 months."],
    concerns: [
      { title: "Titration is not improving", category: "clinical", summary: "Titration has been at 36% for 4 months. Drug stock is not the issue. Medicines are not being adjusted enough.", evidence: ["Titration flat at 36% for 4 months", "Drug stock full — not the bottleneck", "Uncontrolled BP rate unchanged at 32%"] },
    ],
    strengths: [],
    verify: ["Sample 15 patients with high BP over the last 3 months. Were medicines changed?", "Talk to medical officers about their approach to adjusting medicines."],
    notes: [],
  },
  { name: "CC Gopkanu", patients: 127, bpControl: 59, bpControlT: 1, bpUncontrolled: 19, bpUncontrolledT: 15, missed3m: 22, missed3mT: -12, missed12m: 6, titration: 66, titrationT: 5, statins: 61, statinsT: -2, fudging: 3.4, fudgingT: -0.1, drugStock: "full", daysStock: 95, status: "risk", monthsFlagged: 0, isNew: false,
    cardInsights: ["BP control is 60%, 2 points below the facility's own average.", "Patients come regularly (22% missed visits).", "Slight dip from baseline. Worth watching."],
    detailSummary: ["BP control dropped from a 6-month average of 62% to 60%.", "Patients are coming regularly. Small dip is likely clinical."],
    concerns: [
      { title: "Small deviation from baseline", category: "outcomes", summary: "This facility was stable around 62% for 6 months. A 2-point drop is small but in the wrong direction. Worth a brief check before it grows.", evidence: ["BP control at 60%, down 1 pp", "Prior 6-month average was 62%", "Retention is stable"] },
    ],
    strengths: [
      { title: "Strong patient engagement", category: "retention", summary: "Missed visit rate at 22% is well below district average. Patients trust the facility.", evidence: ["Missed visits at 22%", "Stable retention for 6 months"] },
    ],
    verify: ["Review the last 10 patients whose BP became uncontrolled. Were medicines adjusted?"],
    notes: [],
  },
  { name: "CC Gungadiya", patients: 158, bpControl: 56, bpControlT: 7, bpUncontrolled: 38, bpUncontrolledT: -2, missed3m: 18, missed3mT: -6, missed12m: 8, titration: 90, titrationT: 8, statins: 81, statinsT: 8, fudging: 1.4, fudgingT: -0.1, drugStock: "full", daysStock: 91, status: "improving", monthsFlagged: 0, isNew: false,
    cardInsights: ["Biggest improvement this month — up 6 points to 56%.", "Calling overdue patients before their visit is working.", "Data is reliable (4% fudging) and drug stock is full."],
    detailSummary: ["Biggest improvement in the district — up 6 points.", "Reminder calls to overdue patients are working."],
    concerns: [],
    strengths: [
      { title: "Reminder call approach is working", category: "retention", summary: "The team now calls overdue patients and reminds them to take medicines before visiting. Missed visits dropped and BP control rose 6 points.", evidence: ["BP control up 6 pp in 1 month", "Missed visits down 2 pp to 27%", "Titration up 3 pp to 42%"] },
      { title: "Clinical practice is strong", category: "clinical", summary: "Titration rose 3 points this month. Doctors are actively adjusting medicines for patients with high BP.", evidence: ["Titration up 3 pp to 42%", "Statin prescription up 2 pp to 50%", "Uncontrolled BP down 3 pp"] },
    ],
    verify: ["Ask the team to write down the exact reminder call script.", "Share the approach with CC Jamalpur and CC Hossainpur."],
    notes: [
      { date: "10-Apr-2026", author: "Dr Rhati", body: "Visited. Facility in-charge described a simple script: call the day before, confirm patient has medicines at home, remind about appointment time. Documenting for replication." },
      { date: "12-Apr-2026", author: "Dr Sumara", body: "Call log reviewed: entries include outcome and next action. Recommended adding a 'reachable/not reachable' tick box to speed documentation." },
    ],
  },
  { name: "CC Jamalpur", patients: 172, bpControl: 53, bpControlT: -7, bpUncontrolled: 18, bpUncontrolledT: 11, missed3m: 24, missed3mT: -8, missed12m: 7, titration: 66, titrationT: -2, statins: 55, statinsT: -11, fudging: 3.2, fudgingT: 0, drugStock: "full", daysStock: 82, status: "improving", monthsFlagged: 0, isNew: false,
    cardInsights: ["Up 5 points to 58%. Improving for 2 months in a row.", "Drug stock is full and titration is improving.", "Something changed. Ask the team what."],
    detailSummary: ["Up 5 points this month. Improving for 2 months.", "Drug stock is full. Titration is improving."],
    concerns: [],
    strengths: [
      { title: "Sustained positive momentum", category: "outcomes", summary: "BP control has risen 2 months in a row. Titration and statin rates are both improving.", evidence: ["BP control up 5 pp this month", "2 consecutive months of improvement", "Titration up 2 pp to 40%"] },
    ],
    verify: ["Ask the team what they changed over the last 2 months.", "Make sure drug supply stays steady."],
    notes: [],
  },
  { name: "CC Hossainpur", patients: 121, bpControl: 54, bpControlT: 6, bpUncontrolled: 39, bpUncontrolledT: -2, missed3m: 20, missed3mT: -2, missed12m: 5, titration: 94, titrationT: 2, statins: 92, statinsT: 4, fudging: 1.4, fudgingT: 0, drugStock: "full", daysStock: 68, status: "improving", monthsFlagged: 0, isNew: false,
    cardInsights: ["BP control is 64% — very close to the 63% target.", "Missed visits are low at 19%.", "Up 2 points, improving steadily for 3 months."],
    detailSummary: ["64% BP control. Improving steadily for 3 months.", "Missed visits low at 19% — patients are engaged."],
    concerns: [],
    strengths: [
      { title: "Close to target", category: "outcomes", summary: "BP control is climbing steadily. Patients are coming in. A small push on titration could put this facility above target.", evidence: ["BP control at 64%, up 2 pp", "Missed visits at 19% — among the lowest", "Titration at 44%"] },
    ],
    verify: ["Review remaining patients with uncontrolled BP. Make sure medicines are being adjusted."],
    notes: [],
  },
  { name: "CC Paton", patients: 136, bpControl: 66, bpControlT: 9, bpUncontrolled: 16, bpUncontrolledT: 6, missed3m: 18, missed3mT: -11, missed12m: 6, titration: 64, titrationT: 13, statins: 62, statinsT: 8, fudging: 3, fudgingT: -0.1, drugStock: "full", daysStock: 97, status: "improving", monthsFlagged: 0, isNew: false,
    cardInsights: ["Up 6 points to 66%. Above the district target.", "Titration at 48% — doctors are actively adjusting medicines.", "Fudging is low (3%). Numbers are real."],
    detailSummary: ["Up 6 points to 66%. Above target.", "Titration excellent at 48%."],
    concerns: [],
    strengths: [
      { title: "Strong clinical practice", category: "clinical", summary: "Titration at 48% is among the best in the district. Fudging is low, so the improvement is real.", evidence: ["Titration at 48%, up 3 pp", "Fudging at 3% — data is reliable", "Uncontrolled BP down 2 pp to 18%"] },
    ],
    verify: ["Ask the medical officer to share their approach to adjusting medicines.", "Consider arranging a visit for nearby facility staff to learn from them."],
    notes: [
      { date: "08-Apr-2026", author: "Dr Rhati", body: "Excellent titration practice. MO does chart review each morning for uncontrolled patients. Worth replicating." },
      { date: "09-Apr-2026", author: "Dr Amrita", body: "Verified drug stock card and expiry dates; no imminent expiries. Suggested keeping a small buffer stock for peak weeks." },
    ],
  },
  { name: "CC Tirasigoan", patients: 123, bpControl: 67, bpControlT: -15, bpUncontrolled: 9, bpUncontrolledT: 4, missed3m: 24, missed3mT: -1, missed12m: 6, titration: 61, titrationT: -1, statins: 45, statinsT: 7, fudging: 3.4, fudgingT: 0.3, drugStock: "low", daysStock: 14, status: "target", monthsFlagged: 0, isNew: false,
    cardInsights: ["BP control is 67% — above target and steady.", "Small dip of 1 point is normal variation.", "All indicators look healthy."],
    detailSummary: ["67% BP control — above target and stable."],
    concerns: [],
    strengths: [
      { title: "Stable, on target", category: "outcomes", summary: "Small month-to-month changes are normal. Nothing to act on.", evidence: ["BP control at 67% — above target", "All indicators stable", "Drug stock full"] },
    ],
    verify: ["No action needed this month."],
    notes: [
      { date: "06-Feb-2026", author: "Dr Rhati", body: "Quick spot-check: BP cuffs calibrated and register entries complete. No immediate issues flagged." },
      { date: "21-Mar-2026", author: "Dr Sumara", body: "Observed patient flow was smooth; suggested a monthly mini-audit of 10 uncontrolled charts to keep titration consistent." },
      { date: "17-Apr-2026", author: "Dr Amrita", body: "Stock card review: adequate buffer maintained. Recommended keeping reorder date visible on the wall to avoid last-minute requisitions." },
    ],
  },
  { name: "CC Hakurbazar", patients: 122, bpControl: 69, bpControlT: 15, bpUncontrolled: 1, bpUncontrolledT: 14, missed3m: 30, missed3mT: 1, missed12m: 6, titration: 78, titrationT: 5, statins: 69, statinsT: -14, fudging: 2.8, fudgingT: 0.1, drugStock: "partial", daysStock: 31, status: "target", monthsFlagged: 0, isNew: false,
    cardInsights: ["BP control is 69% — above target.", "No change from last month.", "Clean data, full stock, balanced indicators."],
    detailSummary: ["69% BP control — above target and stable."],
    concerns: [],
    strengths: [{ title: "Stable, on target", category: "outcomes", summary: "All indicators are healthy. No intervention needed.", evidence: ["BP control at 69%", "No change from last month", "Fudging at 4%"] }],
    verify: ["No action needed this month."],
    notes: [],
  },
  { name: "CC Niyagul", patients: 146, bpControl: 56, bpControlT: -6, bpUncontrolled: 13, bpUncontrolledT: 10, missed3m: 18, missed3mT: -4, missed12m: 5, titration: 61, titrationT: -3, statins: 58, statinsT: 4, fudging: 3.2, fudgingT: 0.3, drugStock: "full", daysStock: 90, status: "target", monthsFlagged: 0, isNew: false,
    cardInsights: ["BP control is 69% — above target.", "All indicators stable.", "Low fudging and good retention."],
    detailSummary: ["69% BP control — above target and stable."],
    concerns: [],
    strengths: [{ title: "Stable, on target", category: "outcomes", summary: "No action needed.", evidence: ["BP control at 69%", "Missed visits at 23%", "Fudging at 4%"] }],
    verify: ["No action needed this month."],
    notes: [],
  },
  { name: "CC Choto Desh", patients: 176, bpControl: 71, bpControlT: 11, bpUncontrolled: 5, bpUncontrolledT: 5, missed3m: 24, missed3mT: -6, missed12m: 6, titration: 90, titrationT: 4, statins: 78, statinsT: -3, fudging: 1.7, fudgingT: -0.3, drugStock: "full", daysStock: 97, status: "target", monthsFlagged: 0, isNew: false,
    cardInsights: ["71% BP control. Well above district average of 54%.", "Clean data (3% fudging) and full drug stock.", "No change from last month."],
    detailSummary: ["71% BP control. Stable and well above district average."],
    concerns: [],
    strengths: [{ title: "Stable, on target", category: "outcomes", summary: "Solid performer with clean data.", evidence: ["BP control at 71%", "Fudging at 3%", "Above district average"] }],
    verify: ["No action needed this month."],
    notes: [],
  },
  { name: "CC Nandisri", patients: 139, bpControl: 57, bpControlT: 6, bpUncontrolled: 37, bpUncontrolledT: -6, missed3m: 20, missed3mT: -4, missed12m: 6, titration: 83, titrationT: 1, statins: 83, statinsT: 4, fudging: 2.3, fudgingT: 0.1, drugStock: "full", daysStock: 94, status: "target", monthsFlagged: 0, isNew: false,
    cardInsights: ["71% BP control. Small 1-point dip is normal.", "All other indicators unchanged."],
    detailSummary: ["71% BP control. Stable."],
    concerns: [],
    strengths: [{ title: "Stable, on target", category: "outcomes", summary: "Small variation is expected.", evidence: ["BP control at 71%", "Dip of 1 pp within normal range", "All other indicators stable"] }],
    verify: ["No action needed this month."],
    notes: [],
  },
  { name: "CC Rajnagor", patients: 115, bpControl: 62, bpControlT: 5, bpUncontrolled: 31, bpUncontrolledT: -7, missed3m: 19, missed3mT: -2, missed12m: 5, titration: 90, titrationT: 5, statins: 85, statinsT: 4, fudging: 2.1, fudgingT: -0.2, drugStock: "full", daysStock: 102, status: "improving", monthsFlagged: 0, isNew: false,
    cardInsights: ["Up 4 points to 72%. Already above target.", "Local radio message about drug availability brought patients back.", "Titration is also improving."],
    detailSummary: ["Up 4 points to 72%. Already above target.", "Local radio broadcast brought patients back to care."],
    concerns: [],
    strengths: [
      { title: "Creative community outreach", category: "retention", summary: "Local radio broadcast told patients drugs were in stock. Patients came back.", evidence: ["BP control up 4 pp to 72%", "Missed visits down 1 pp", "Community radio outreach launched in March"] },
    ],
    verify: ["Ask the team to describe the radio outreach step by step.", "Share the approach with facilities that have low visit rates."],
    notes: [
      { date: "01-Apr-2026", author: "Dr Rhati", body: "Team arranged a 2-minute slot on local radio for 2 weeks. Message was simple: 'Medicines are in stock, please come for your check-up.' Worth trying elsewhere." },
    ],
  },
  { name: "CC Lalarchak", patients: 109, bpControl: 72, bpControlT: 15, bpUncontrolled: 0, bpUncontrolledT: -11, missed3m: 28, missed3mT: -13, missed12m: 6, titration: 81, titrationT: -6, statins: 82, statinsT: 7, fudging: 1.7, fudgingT: 0.1, drugStock: "full", daysStock: 99, status: "target", monthsFlagged: 0, isNew: false,
    cardInsights: ["73% BP control. Solid and stable.", "Missed visits slightly higher than top performers.", "Room to grow with better retention."],
    detailSummary: ["73% BP control. Stable and above target."],
    concerns: [],
    strengths: [{ title: "Stable, on target", category: "outcomes", summary: "Retention could be a little better.", evidence: ["BP control at 73%", "Missed visits at 24%", "All other indicators healthy"] }],
    verify: ["No urgent action. Monitor monthly."],
    notes: [],
  },
  { name: "CC Nij Chaura", patients: 216, bpControl: 75, bpControlT: 15, bpUncontrolled: 3, bpUncontrolledT: -15, missed3m: 22, missed3mT: -5, missed12m: 5, titration: 94, titrationT: 1, statins: 90, statinsT: 10, fudging: 1.1, fudgingT: 0, drugStock: "full", daysStock: 103, status: "top", monthsFlagged: 0, isNew: false,
    cardInsights: ["75% BP control. Balanced indicators.", "Titration is strong at 50%. Fudging is very low at 3%.", "Consistent top performer."],
    detailSummary: ["75% BP control. One of the top facilities in the district."],
    concerns: [],
    strengths: [
      { title: "Role model facility", category: "clinical", summary: "Titration at 50% and fudging at 3% are both very good. Could mentor nearby struggling facilities.", evidence: ["Titration at 50%", "Fudging at 3%", "BP control at 75%"] },
    ],
    verify: ["Could be paired as a mentor for nearby underperforming facilities."],
    notes: [],
  },
  { name: "CC Kargram", patients: 213, bpControl: 78, bpControlT: 10, bpUncontrolled: 7, bpUncontrolledT: -5, missed3m: 15, missed3mT: -15, missed12m: 3, titration: 90, titrationT: 2, statins: 82, statinsT: 14, fudging: 1.6, fudgingT: 0.3, drugStock: "full", daysStock: 107, status: "top", monthsFlagged: 0, isNew: false,
    cardInsights: ["78% BP control. Second highest in the district.", "Lowest missed visits at 16% — the gold standard.", "Strong clinical practice across the board."],
    detailSummary: ["78% BP control. Second highest in the district.", "Lowest missed visit rate at 16%."],
    concerns: [],
    strengths: [
      { title: "Benchmark facility", category: "outcomes", summary: "Top titration, lowest fudging, lowest missed visits. This facility represents what good looks like.", evidence: ["BP control at 78%", "Missed visits at 16%", "Fudging at 2%"] },
    ],
    verify: ["Use as a benchmark for other facilities.", "Document the specific practices used here."],
    notes: [],
  },
  { name: "CC Kayasthagram", patients: 142, bpControl: 80, bpControlT: -4, bpUncontrolled: 1, bpUncontrolledT: 15, missed3m: 19, missed3mT: -12, missed12m: 4, titration: 80, titrationT: -9, statins: 75, statinsT: 7, fudging: 2.2, fudgingT: -0.2, drugStock: "full", daysStock: 96, status: "top", monthsFlagged: 0, isNew: false,
    cardInsights: ["Highest BP control in the district at 80%.", "Close follow-up with new patients in first 3 months is working.", "Excellent on every indicator."],
    detailSummary: ["Highest BP control in the district at 80%.", "Close follow-up with new patients for their first 3 months built trust."],
    concerns: [],
    strengths: [
      { title: "Star of the month", category: "retention", summary: "Monthly visits for new patients during the first 3 months are the key practice. This should be standard across the district.", evidence: ["BP control at 80% — highest in district", "Titration at 55%", "Fudging at 2%"] },
    ],
    verify: ["Document the new patient follow-up protocol in detail.", "Roll out the practice to other facilities."],
    notes: [
      { date: "15-Mar-2026", author: "Dr Rhati", body: "Documented their new patient follow-up: monthly visits for first 3 months with mandatory BP check and adherence discussion. Rolling out to 5 other facilities as pilot." },
      { date: "16-Mar-2026", author: "Dr Sumara", body: "Observed counselling: staff use a simple 3-question adherence check. Recommend sharing script with neighboring CCs." },
    ],
  },
];

export const FACILITIES: Facility[] = seeds.map((s) => ({
  ...s,
  id: idOf(s.name),
}));

// Composite priority score (lower = more urgent). Used in backend ranking only.
export function priorityScore(f: Facility): number {
  const outcomes = (100 - f.bpControl) * 0.35;
  const retention = f.missed3m * 0.25;
  const clinical = (100 - f.titration) * 0.25;
  const dataPenalty = f.fudging * 0.15;
  let score = -(outcomes + retention + clinical + dataPenalty);
  if (f.isNew) score -= 10;
  if (f.status === "stagnating") score -= 8;
  if (f.monthsFlagged >= 2) score -= 5;
  return score;
}

// Rank facilities by need-attention priority (status band first, then BP)
export function rankNeedsAttention(facilities: Facility[]): Facility[] {
  const statusRank: Record<FacilityStatus, number> = {
    action: 0, // Critical
    risk: 1, // At risk
    stagnating: 2,
    improving: 3,
    target: 99,
    top: 99,
  };

  return [...facilities]
    .filter((f) => f.status in statusRank && statusRank[f.status] < 99)
    .sort((a, b) => {
      const ar = statusRank[a.status];
      const br = statusRank[b.status];
      if (ar !== br) return ar - br;
      // Within the same band, put lowest BP control first.
      return a.bpControl - b.bpControl;
    });
}

// Top 3 needs-attention. Excludes dismissed, but keeps refilling so 3 are always shown
// when enough candidates exist. Pinned (within the candidate pool) are floated to the top.
export function getNeedsAttention(
  facilities: Facility[],
  dismissed: Set<string> = new Set(),
  pinned: Set<string> = new Set(),
  limit = 3,
): Facility[] {
  const ranked = rankNeedsAttention(facilities).filter((f) => !dismissed.has(f.id));
  const top = ranked.slice(0, limit);
  // Keep the requested priority order, but float pinned within the selected set.
  return top.sort((a, b) => {
    const ap = pinned.has(a.id) ? 1 : 0;
    const bp = pinned.has(b.id) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    // Stable-ish fallback
    return 0;
  });
}
