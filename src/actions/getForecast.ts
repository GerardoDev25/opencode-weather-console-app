import { forecastWeekC } from "../api/weather";
import { error, showForecast } from "../presentation/output";
import { loadCities } from "../storage/citiesStorage";
import { loadSettings } from "../storage/settingsStorage";
import { resolveDefaultCity } from "./getWeather";

export async function getForecast(): Promise<void> {
  const cities = await loadCities();
  const settings = await loadSettings();
  const city = resolveDefaultCity(cities);
  if (!city) {
    return;
  }

  try {
    const daily = await forecastWeekC(city.latitude, city.longitude);
    showForecast(city, daily, settings.unit);
  } catch {
    error("  No se pudo contactar a OpenMeteo. Verifica tu conexión.");
  }
}
