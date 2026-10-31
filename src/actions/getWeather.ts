import { currentTemperatureC } from "../api/weather";
import { error, showWeather } from "../presentation/output";
import { loadCities } from "../storage/citiesStorage";
import { loadSettings } from "../storage/settingsStorage";
import type { CitiesData, City } from "../types/City";

export function resolveDefaultCity(data: CitiesData): City | null {
  if (!data.defaultCity) {
    error("  No hay ciudad default. Usa la opción 5 para establecer una.");
    return null;
  }

  const city = data.cities.find((c) => c.name === data.defaultCity);
  if (!city) {
    error(`  "${data.defaultCity}" no está en la lista de ciudades.`);
    return null;
  }

  return city;
}

export async function getWeatherDefault(): Promise<void> {
  const cities = await loadCities();
  const settings = await loadSettings();
  const city = resolveDefaultCity(cities);
  if (!city) {
    return;
  }

  try {
    const temp = await currentTemperatureC(city.latitude, city.longitude);
    showWeather(city, temp, settings.unit);
  } catch {
    error("  No se pudo contactar a OpenMeteo. Verifica tu conexión.");
  }
}

export async function getWeatherAll(): Promise<void> {
  const cities = await loadCities();
  const settings = await loadSettings();

  if (cities.cities.length === 0) {
    error("  No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }

  for (const city of cities.cities) {
    try {
      const temp = await currentTemperatureC(city.latitude, city.longitude);
      showWeather(city, temp, settings.unit);
    } catch {
      error(`  ${city.name}: error al consultar el clima`);
    }
  }
}
