import { NextResponse } from "next/server";
import { normalizeMovementRows, parseCsv } from "@/src/lib/csv";
import { sampleMovements } from "@/src/lib/sample-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const sourceUrl = process.env.GOOGLE_SHEETS_CSV_URL;

  if (!sourceUrl) {
    return NextResponse.json({ records: sampleMovements });
  }

  const response = await fetch(sourceUrl, { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json(
      { error: `Google Sheets CSV fetch failed with status ${response.status}` },
      { status: 502 }
    );
  }

  const rows = parseCsv(await response.text());
  return NextResponse.json({ records: normalizeMovementRows(rows) });
}
