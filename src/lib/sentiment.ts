/**
 * Lightweight sentiment classifier for short bullet insights.
 * Returns "positive" if the bullet reads as a strength / reassurance,
 * otherwise "negative". Used to tint bullet markers red vs green.
 */
export function classifyInsight(text: string): "positive" | "negative" {
  const t = text.toLowerCase();

  // Strong positive cues — phrasings used in the seed data to reassure
  // ("drug stock is full", "fudging is low", "numbers are real", "could improve quickly", etc.)
  const positivePatterns: RegExp[] = [
    /\bis full\b/,
    /\bis steady\b/,
    /\bare real\b/,
    /\bnumbers are real\b/,
    /\bnot the problem\b/,
    /\bis low\b.*\bfudging\b|\bfudging\b.*\bis low\b/,
    /\bcould improve quickly\b/,
    /\bimproved\b/,
    /\bimproving\b/,
    /\bon track\b/,
    /\babove target\b/,
    /\bbest in\b/,
    /\bstrong\b/,
    /\bstable\b/,
  ];

  if (positivePatterns.some((re) => re.test(t))) return "positive";
  return "negative";
}
