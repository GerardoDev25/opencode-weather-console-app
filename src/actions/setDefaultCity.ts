import { readNumber } from "../presentation/input";
import { error, showCities, success } from "../presentation/output";
import { loadCities, saveCities } from "../storage/citiesStorage";

export async function setDefaultCity(): Promise<void> {
  const data = await loadCities();

  if (data.cities.length === 0) {
    error("  No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }

  showCities(data.cities, data.defaultCity);

  const num = await readNumber("  Número de la ciudad default (0 para cancelar): ");
  if (num === null || num === 0) {
    error("  No se cambió la ciudad default.");
    return;
  }

  const city = data.cities[num - 1];
  if (!city) {
    error("  Número inválido.");
    return;
  }

  data.defaultCity = city.name;
  await saveCities(data);
  success(`  Ciudad default: ${city.name}`);
}
