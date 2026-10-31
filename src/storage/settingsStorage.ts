import type { Settings } from "../types/Settings";
import { SETTINGS_FILE } from "../utils/constants";

export function defaultSettings(): Settings {
  return { unit: "°C" };
}

export async function loadSettings(): Promise<Settings> {
  try {
    const file = Bun.file(SETTINGS_FILE);
    if (!(await file.exists())) {
      return defaultSettings();
    }

    const raw = (await file.json()) as Partial<Settings>;
    return { unit: raw.unit === "°F" ? "°F" : "°C" };
  } catch {
    return defaultSettings();
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await Bun.write(SETTINGS_FILE, JSON.stringify(settings, null, 2) + "\n");
}
