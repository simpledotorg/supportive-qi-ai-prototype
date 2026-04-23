// Generate a 6-point series consistent with current value + monthly delta.
// The current value is at index 5 (last). Earlier months drift back toward
// (current - delta * scale) so the visible direction matches the delta sign.

export function generateSeries(current: number, delta: number, len = 6): number[] {
  // total spread across the 6 months — emphasized so trend is legible
  const spread = Math.max(2, Math.abs(delta) * 3);
  const start = current - (delta >= 0 ? spread : -spread);
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    const t = i / (len - 1);
    // smooth ease + a touch of noise, deterministic
    const ease = t * t * (3 - 2 * t);
    const noise = Math.sin((i + current * 0.13) * 1.7) * 0.6;
    let v = start + (current - start) * ease + noise;
    if (i === len - 1) v = current;
    out.push(Math.max(0, Math.min(100, Math.round(v * 10) / 10)));
  }
  return out;
}

export function sparkPath(data: number[], width: number, height: number, pad = 2): string {
  if (data.length < 2) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (width - pad * 2) / (data.length - 1);
  return data
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export type DotTone = "good" | "bad" | "flat";

export function dotTone(delta: number, goodDir: "up" | "down"): DotTone {
  if (delta === 0) return "flat";
  const positive = delta > 0;
  if (goodDir === "up") return positive ? "good" : "bad";
  return positive ? "bad" : "good";
}
