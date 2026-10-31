import { success } from "../presentation/output";
import { loadSettings, saveSettings } from "../storage/settingsStorage";

export async function setUnit(): Promise<void> {
  const settings = await loadSettings();
  settings.unit = settings.unit === "°C" ? "°F" : "°C";
  await saveSettings(settings);
  success(`  Unidad de temperatura: ${settings.unit}`);
}
