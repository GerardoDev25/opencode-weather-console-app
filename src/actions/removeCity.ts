import { readNumber } from "../presentation/input";
import { error, showCities, success } from "../presentation/output";
import { loadCities, saveCities } from "../storage/citiesStorage";

export async function removeCity(): Promise<void> {
  const data = await loadCities();

  if (data.cities.length === 0) {
    error("  No hay ciudades guardadas.");
    return;
  }

  showCities(data.cities, data.defaultCity);

  const num = await readNumber("  Número a eliminar (0 para cancelar): ");
  if (num === null || num === 0) {
    error("  No se eliminó nada.");
    return;
  }

  const city = data.cities[num - 1];
  if (!city) {
    error("  Número inválido.");
    return;
  }

  data.cities.splice(num - 1, 1);
  if (data.defaultCity === city.name) {
    data.defaultCity = data.cities[0]?.name ?? null;
  }
  await saveCities(data);
  success(`  "${city.name}" eliminada.`);
}
