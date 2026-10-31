import { unlink } from "node:fs/promises";
import type { CitiesData } from "../types/City";
import { CITIES_FILE, LEGACY_DATA_FILE } from "../utils/constants";
import { saveSettings } from "./settingsStorage";

export function defaultCitiesData(): CitiesData {
  return { cities: [], defaultCity: null };
}

export async function loadCities(): Promise<CitiesData> {
  try {
    const file = Bun.file(CITIES_FILE);
    if (await file.exists()) {
      const raw = (await file.json()) as Partial<CitiesData>;
      return {
        cities: raw.cities ?? [],
        defaultCity: raw.defaultCity ?? null,
      };
    }

    return (await migrateLegacyData()) ?? defaultCitiesData();
  } catch {
    return defaultCitiesData();
  }
}

export async function saveCities(data: CitiesData): Promise<void> {
  await Bun.write(CITIES_FILE, JSON.stringify(data, null, 2) + "\n");
}

async function migrateLegacyData(): Promise<CitiesData | null> {
  const legacy = Bun.file(LEGACY_DATA_FILE);
  if (!(await legacy.exists())) {
    return null;
  }

  try {
    const raw = (await legacy.json()) as Partial<CitiesData> & { unit?: unknown };
    const data: CitiesData = {
      cities: raw.cities ?? [],
      defaultCity: raw.defaultCity ?? null,
    };

    await saveCities(data);
    await saveSettings({ unit: raw.unit === "°F" ? "°F" : "°C" });
    await unlink(LEGACY_DATA_FILE);
    return data;
  } catch {
    return null;
  }
}
