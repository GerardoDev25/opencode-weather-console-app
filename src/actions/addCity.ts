import { findCity } from "../api/geocoding";
import { ask, readYesNo } from "../presentation/input";
import { error, success } from "../presentation/output";
import { loadCities, saveCities } from "../storage/citiesStorage";
import type { City } from "../types/City";

export async function addCity(): Promise<void> {
  const name = (await ask("  Ciudad a buscar: ")).trim();
  if (!name) {
    error("  Debes escribir el nombre de una ciudad.");
    return;
  }

  let newCity: City | null;
  try {
    newCity = await findCity(name);
  } catch {
    error("  No se pudo contactar a la API de geocoding. Verifica tu conexión.");
    return;
  }

  if (!newCity) {
    error(`  No se encontró la ciudad "${name}".`);
    return;
  }

  success(`  ${newCity.name}, ${newCity.country} (${newCity.latitude}, ${newCity.longitude})`);
  if (!(await readYesNo("  ¿Agregar? (s/n): "))) {
    error("  No se agregó la ciudad.");
    return;
  }

  const data = await loadCities();
  if (data.cities.some((c) => c.name.toLowerCase() === newCity.name.toLowerCase())) {
    error(`  "${newCity.name}" ya está guardada.`);
    return;
  }

  data.cities.push(newCity);
  if (!data.defaultCity) {
    data.defaultCity = newCity.name;
  }
  await saveCities(data);
  success(`  "${newCity.name}" guardada.`);
}
