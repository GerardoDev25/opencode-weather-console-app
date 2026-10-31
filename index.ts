import { green, red, yellow } from "./src/colors";
import { currentTemperatureC, findCity } from "./src/openmeteo";
import { loadStore, saveStore } from "./src/storage";
import type { Store } from "./src/types";
import { ask, closeUi, formatTemp, renderMenu } from "./src/ui";

async function showWeather(store: Store, name: string, latitude: number, longitude: number) {
  const temp = await currentTemperatureC(latitude, longitude);
  console.log(`  ${name}: ${yellow(formatTemp(temp, store.unit))}`);
}

async function weatherDefault(store: Store) {
  if (!store.defaultCity) {
    console.log(red("  No hay ciudad default. Usa la opción 5 para establecer una."));
    return;
  }

  const city = store.cities.find((c) => c.name === store.defaultCity);
  if (!city) {
    console.log(red(`  "${store.defaultCity}" no está en la lista de ciudades.`));
    return;
  }

  try {
    await showWeather(store, `${city.name}, ${city.country}`, city.latitude, city.longitude);
  } catch {
    console.log(red("  No se pudo contactar a OpenMeteo. Verifica tu conexión."));
  }
}

async function weatherAll(store: Store) {
  if (store.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Usa la opción 3 para agregar una."));
    return;
  }

  for (const city of store.cities) {
    try {
      await showWeather(store, `${city.name}, ${city.country}`, city.latitude, city.longitude);
    } catch {
      console.log(red(`  ${city.name}: error al consultar el clima`));
    }
  }
}

async function addCity(store: Store) {
  const name = (await ask("  Ciudad a buscar: ")).trim();
  if (!name) {
    console.log(red("  Debes escribir el nombre de una ciudad."));
    return;
  }

  let newCity;
  try {
    newCity = await findCity(name);
  } catch {
    console.log(red("  No se pudo contactar a la API de geocoding. Verifica tu conexión."));
    return;
  }

  if (!newCity) {
    console.log(red(`  No se encontró la ciudad "${name}".`));
    return;
  }

  console.log(green(`  ${newCity.name}, ${newCity.country} (${newCity.latitude}, ${newCity.longitude})`));
  const answer = (await ask("  ¿Agregar? (s/n): ")).trim().toLowerCase();
  if (answer !== "s" && answer !== "si" && answer !== "sí") {
    console.log(red("  No se agregó la ciudad."));
    return;
  }

  if (store.cities.some((c) => c.name.toLowerCase() === newCity.name.toLowerCase())) {
    console.log(red(`  "${newCity.name}" ya está guardada.`));
    return;
  }

  store.cities.push(newCity);
  if (!store.defaultCity) {
    store.defaultCity = newCity.name;
  }
  await saveStore(store);
  console.log(green(`  "${newCity.name}" guardada.`));
}

async function removeCity(store: Store) {
  if (store.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas."));
    return;
  }

  store.cities.forEach((c, i) => {
    const label = c.name === store.defaultCity ? `${c.name}, ${c.country} (default)` : `${c.name}, ${c.country}`;
    console.log(`  ${i + 1}. ${label}`);
  });

  const answer = (await ask("  Número a eliminar (0 para cancelar): ")).trim();
  const num = Number(answer);
  if (Number.isNaN(num) || !Number.isInteger(num) || num === 0) {
    console.log(red("  No se eliminó nada."));
    return;
  }

  const city = store.cities[num - 1];
  if (!city) {
    console.log(red("  Número inválido."));
    return;
  }

  store.cities.splice(num - 1, 1);
  if (store.defaultCity === city.name) {
    store.defaultCity = store.cities[0]?.name ?? null;
  }
  await saveStore(store);
  console.log(green(`  "${city.name}" eliminada.`));
}

async function setDefaultCity(store: Store) {
  if (store.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Usa la opción 3 para agregar una."));
    return;
  }

  store.cities.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.name}, ${c.country}`);
  });

  const answer = (await ask("  Número de la ciudad default (0 para cancelar): ")).trim();
  const num = Number(answer);
  if (Number.isNaN(num) || !Number.isInteger(num) || num === 0) {
    console.log(red("  No se cambió la ciudad default."));
    return;
  }

  const city = store.cities[num - 1];
  if (!city) {
    console.log(red("  Número inválido."));
    return;
  }

  store.defaultCity = city.name;
  await saveStore(store);
  console.log(green(`  Ciudad default: ${city.name}`));
}

async function toggleUnit(store: Store) {
  store.unit = store.unit === "°C" ? "°F" : "°C";
  await saveStore(store);
  console.log(green(`  Unidad de temperatura: ${store.unit}`));
}

async function main() {
  const store = await loadStore();

  while (true) {
    renderMenu(store);

    const option = (await ask("  Selecciona una opción: ")).trim();

    if (option === "1") {
      await weatherDefault(store);
    } else if (option === "2") {
      await weatherAll(store);
    } else if (option === "3") {
      await addCity(store);
    } else if (option === "4") {
      await removeCity(store);
    } else if (option === "5") {
      await setDefaultCity(store);
    } else if (option === "8") {
      await toggleUnit(store);
    } else if (option === "9") {
      closeUi();
      console.log("  ¡Hasta luego!");
      break;
    } else {
      console.log(red(`  Opción inválida: "${option}"`));
    }
  }
}

main();
