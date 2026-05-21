import { describe, expect, it } from "vitest";
import { DonutChart } from "@/src/components/donut-chart";
import { buildAnnularPath, sliceMidpoint } from "@/src/lib/donut-geometry";

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
  const expanded = expand(node);
  if (expanded !== node) return collectStrings(expanded, acc);
  if (typeof node === "object" && "props" in (node as Record<string, unknown>)) {
    collectStrings((node as { props?: { children?: unknown } }).props?.children, acc);
  }
  return acc;
}

function findByType(node: unknown, type: string, results: unknown[] = []): unknown[] {
  if (node == null || typeof node === "boolean") return results;
  if (Array.isArray(node)) {
    node.forEach((child) => findByType(child, type, results));
    return results;
  }
  if (typeof node === "object" && "type" in (node as Record<string, unknown>)) {
    const expanded = expand(node);
    if (expanded !== node) return findByType(expanded, type, results);
    const el = node as { type: unknown; props?: { children?: unknown } };
    if (el.type === type) results.push(el);
    findByType(el.props?.children, type, results);
  }
  return results;
}

describe("donut-geometry", () => {
  it("buildAnnularPath returns a closed M..A..L..A..Z command string", () => {
    const d = buildAnnularPath({ cx: 100, cy: 100, rOuter: 70, rInner: 40, startFrac: 0, endFrac: 0.25 });
    expect(d.startsWith("M ")).toBe(true);
    expect(d).toContain(" A 70 70 ");
    expect(d).toContain(" L ");
    expect(d).toContain(" A 40 40 ");
    expect(d.endsWith(" Z")).toBe(true);
  });

  it("buildAnnularPath sets large-arc flag for sweeps over half a turn", () => {
    const small = buildAnnularPath({ cx: 0, cy: 0, rOuter: 10, rInner: 5, startFrac: 0, endFrac: 0.4 });
    const big = buildAnnularPath({ cx: 0, cy: 0, rOuter: 10, rInner: 5, startFrac: 0, endFrac: 0.6 });
    expect(small).toContain(" 0 1 ");
    expect(big).toContain(" 1 1 ");
  });

  it("sliceMidpoint returns the angle at (start+end)/2", () => {
    const mid = sliceMidpoint(0, 0, 10, 0, 0.5);
    expect(mid.angleRad).toBeCloseTo(Math.PI / 2, 6);
    expect(mid.x).toBeCloseTo(10, 6);
    expect(mid.y).toBeCloseTo(0, 6);
  });
});

describe("DonutChart", () => {
  it("renders one annular path per non-zero slice plus a centre total", () => {
    const tree = DonutChart({
      title: "Status",
      emptyLabel: "No data",
      data: [
        { label: "A", value: 2, color: "#ff0000" },
        { label: "B", value: 3, color: "#00ff00" }
      ]
    });

    expect(findByType(tree, "path").length).toBe(2);
    expect(((findByType(tree, "path")[0] as { props?: { d?: string } }).props?.d ?? "")).toContain(" A 140 140 ");
    expect(((findByType(tree, "path")[0] as { props?: { d?: string } }).props?.d ?? "")).toContain(" A 84 84 ");
    const texts = findByType(tree, "text") as { props?: { children?: unknown } }[];
    const centre = texts.find((t) => collectStrings(t.props?.children).join("") === "5");
    expect(centre).toBeDefined();
  });

  it("renders slice annotations close to slices with no leader lines when labels do not overlap", () => {
    const tree = DonutChart({
      title: "Status",
      emptyLabel: "No data",
      data: [
        { label: "Visiting", value: 6, color: "#facc15" },
        { label: "Completed", value: 4, color: "#22c55e" }
      ]
    });

    const polylines = findByType(tree, "polyline");
    expect(polylines.length).toBe(0);

    const labelTexts = collectStrings(tree).join("|");
    expect(labelTexts).toContain("Visiting 60%");
    expect(labelTexts).toContain("Completed 40%");
  });

  it("renders leader lines only for labels displaced to avoid overlap", () => {
    const tree = DonutChart({
      title: "Duration",
      emptyLabel: "No data",
      data: [
        { label: "0-30", value: 1, color: "#000" },
        { label: "31-60", value: 1, color: "#111" },
        { label: "61-90", value: 1, color: "#222" },
        { label: "91-120", value: 1, color: "#333" },
        { label: "121-150", value: 1, color: "#444" },
        { label: "151-180", value: 1, color: "#555" },
        { label: "180+", value: 1, color: "#666" }
      ]
    });

    const polylines = findByType(tree, "polyline");
    const texts = findByType(tree, "text") as { props?: { children?: unknown } }[];
    const labelTexts = texts.filter((t) => collectStrings(t.props?.children).join("").includes("%"));
    expect(labelTexts.length).toBe(7);
    expect(polylines.length).toBeGreaterThan(0);
    expect(polylines.length).toBeLessThan(7);
  });

  it("suppresses annotations for slices smaller than 3% of the total", () => {
    const tree = DonutChart({
      title: "Status",
      emptyLabel: "No data",
      data: [
        { label: "Big", value: 98, color: "#22c55e" },
        { label: "Tiny", value: 2, color: "#ef4444" }
      ]
    });

    const labels = collectStrings(tree).join("|");
    expect(labels).toContain("Big 98%");
    expect(labels).not.toContain("Tiny 2%");
  });

  it("renders the legend rows with label, percent and value to the right of the chart", () => {
    const tree = DonutChart({
      title: "Status",
      emptyLabel: "No data",
      data: [
        { label: "A", value: 1, color: "#fff" },
        { label: "B", value: 3, color: "#000" }
      ]
    });

    const items = findByType(tree, "li");
    expect(items.length).toBe(2);
    const all = collectStrings(tree).join("|");
    expect(all).toContain("25%");
    expect(all).toContain("75%");
  });

  it("renders an empty placeholder when total is zero", () => {
    const tree = DonutChart({
      title: "Status",
      emptyLabel: "No data",
      data: [{ label: "A", value: 0, color: "#ff0000" }]
    });

    expect(collectStrings(tree).join("|")).toContain("No data");
    expect(findByType(tree, "path").length).toBe(0);
  });

  it("renders concentric circles when one slice fills the donut", () => {
    const tree = DonutChart({
      title: "Status",
      emptyLabel: "No data",
      data: [
        { label: "A", value: 5, color: "#ff0000" },
        { label: "B", value: 0, color: "#00ff00" }
      ]
    });

    const circles = findByType(tree, "circle") as { props?: { r?: number } }[];
    expect(circles.length).toBe(2);
    expect(circles[0].props?.r).toBe(140);
    expect(circles[1].props?.r).toBe(84);
    expect(findByType(tree, "path").length).toBe(0);
  });
});
