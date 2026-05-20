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
  totalRegFlatsToday: 42,
  totalPaxToday: 85,
  activeFlats: 7,
  activePax: 19,
  completedFlats: 31,
  completedPax: 66
};

const labels = translations["zh-Hant"];

describe("SummaryStatsBar", () => {
  it("renders all 6 session metric labels and values", () => {
    const tree = SummaryStatsBar({ metrics: sampleMetrics, labels });
    const strings = collectAllStrings(tree).join("|");

    expect(strings).toContain(labels.totalRegFlatsToday);
    expect(strings).toContain("42");
    expect(strings).toContain(labels.totalPaxToday);
    expect(strings).toContain("85");
    expect(strings).toContain(labels.activeFlats);
    expect(strings).toContain("7");
    expect(strings).toContain(labels.activePax);
    expect(strings).toContain("19");
    expect(strings).toContain(labels.completedFlats);
    expect(strings).toContain("31");
    expect(strings).toContain(labels.completedPax);
    expect(strings).toContain("66");
    expect(strings).toContain("metric-card--active");
    expect(strings).toContain("metric-card--completed");
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
    expect(strings).toContain(enLabels.totalRegFlatsToday);
    expect(strings).toContain(enLabels.completedPax);
  });
});
