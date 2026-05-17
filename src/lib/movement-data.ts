import { normalizeMovementRows, parseCsv } from "./csv";
import { buildCacheBustedCsvUrl } from "./csv-url";
import { type MovementRecord } from "./models";
import { sampleMovements } from "./sample-data";

type MovementResponse = {
  records: MovementRecord[];
};

export async function fetchMovementData(
  csvUrl: string,
  fetchCsv: typeof fetch = fetch
): Promise<MovementResponse> {
  if (!csvUrl) {
    return { records: sampleMovements };
  }

  const response = await fetchCsv(buildCacheBustedCsvUrl(csvUrl), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Google Sheets CSV fetch failed with status ${response.status}`);
  }

  const rows = parseCsv(await response.text());
  return { records: normalizeMovementRows(rows) };
}
