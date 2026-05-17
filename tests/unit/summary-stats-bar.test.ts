import { describe, expect, it } from "vitest";
import { SummaryStatsBar } from "@/src/components/summary-stats-bar";
import { translations } from "@/src/lib/i18n";
import type { SummaryMetrics } from "@/src/lib/models";

function collectStrings(node: unknown, acc: string[] = []): string[] {
  if (node == null || typeof node === "boolean") return acc;
  if (typeof node === "string" || typeof node === "number" || typeof node === "bigint") {
    acc.push(String(node));
    return acc;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => collectStrings(child, acc));
    return acc;
  }
  if (typeof node === "object" && "props" in (node as Record<string, unknown>)) {
    const el = node as { type?: unknown; props?: { children?: unknown; className?: unknown } };
    if (el.props?.className != null) acc.push(String(el.props.className));
    collectStrings(el.props?.children, acc);
  }
  return acc;
}

function expand(node: unknown): unknown {
  if (node == null || typeof node !== "object" || !("type" in (node as Record<string, unknown>))) {
    return node;
  }
  const el = node as { type: unknown; props?: Record<string, unknown> };
  if (typeof el.type === "function") {
    const Comp = el.type as (props: Record<string, unknown>) => unknown;
    return expand(Comp(el.props ?? {}));
  }
  return node;
}

function collectAllStrings(node: unknown, acc: string[] = []): string[] {
  if (node == null || typeof node === "boolean") return acc;
  if (typeof node === "string" || typeof node === "number" || typeof node === "bigint") {
    acc.push(String(node));
    return acc;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => collectAllStrings(child, acc));
    return acc;
  }
  const expanded = expand(node);
  if (expanded !== node) return collectAllStrings(expanded, acc);
  if (typeof node === "object" && "props" in (node as Record<string, unknown>)) {
    const el = node as { props?: { children?: unknown; className?: unknown } };
    if (el.props?.className != null) acc.push(String(el.props.className));
    collectAllStrings(el.props?.children, acc);
  }
  return acc;
}

const sampleMetrics: SummaryMetrics = {
  totalEntries: 42,
  totalPax: 85,
  totalLuggage: 17,
  excessiveLuggageWarnings: 3,
  moderateLuggageWarnings: 5
};

const labels = translations["zh-Hant"];

describe("SummaryStatsBar", () => {
  it("renders all 5 metric labels and values", () => {
    const tree = SummaryStatsBar({ metrics: sampleMetrics, labels });
    const strings = collectAllStrings(tree).join("|");

    expect(strings).toContain(labels.totalEntriesToday);
    expect(strings).toContain("42");
    expect(strings).toContain(labels.totalPax);
    expect(strings).toContain("85");
    expect(strings).toContain(labels.totalLuggage);
    expect(strings).toContain("17");
    expect(strings).toContain(labels.excessiveLuggage);
    expect(strings).toContain("3");
    expect(strings).toContain(labels.moderateLuggage);
    expect(strings).toContain("5");
  });

  it("does not apply compact modifier class when compact is omitted", () => {
    const tree = SummaryStatsBar({ metrics: sampleMetrics, labels });
    const strings = collectStrings(tree).join("|");
    expect(strings).not.toContain("summary-stats-bar--compact");
  });

  it("applies summary-stats-bar--compact class when compact={true}", () => {
    const tree = SummaryStatsBar({ metrics: sampleMetrics, labels, compact: true });
    const strings = collectStrings(tree).join("|");
    expect(strings).toContain("summary-stats-bar--compact");
  });

  it("renders with English labels too", () => {
    const enLabels = translations["en"];
    const tree = SummaryStatsBar({ metrics: sampleMetrics, labels: enLabels });
    const strings = collectAllStrings(tree).join("|");
    expect(strings).toContain(enLabels.totalEntriesToday);
    expect(strings).toContain(enLabels.excessiveLuggage);
  });
});
