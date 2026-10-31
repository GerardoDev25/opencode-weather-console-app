import { error, showCities, success } from "../presentation/output";
import { loadCities } from "../storage/citiesStorage";

export async function listCities(): Promise<void> {
  const data = await loadCities();

  if (data.cities.length === 0) {
    error("  No hay ciudades guardadas. Usa la opción 3 para agregar una.");
    return;
  }

  success(`  Ciudades guardadas (${data.cities.length}):`);
  showCities(data.cities, data.defaultCity);
}
