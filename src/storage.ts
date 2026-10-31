import type { Store, Unit } from "./types";

export const DATA_FILE = "data.json";

function defaultStore(): Store {
  return { cities: [], defaultCity: null, unit: "°C" as Unit };
}

export async function loadStore(): Promise<Store> {
  try {
    const file = Bun.file(DATA_FILE);
    if (!(await file.exists())) {
      return defaultStore();
    }

    const raw = (await file.json()) as Partial<Store>;
    return {
      cities: raw.cities ?? [],
      defaultCity: raw.defaultCity ?? null,
      unit: raw.unit === "°F" ? "°F" : "°C",
    };
  } catch {
    return defaultStore();
  }
}

export async function saveStore(store: Store): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(store, null, 2) + "\n");
}
