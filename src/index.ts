import { addCity } from "./actions/addCity";
import { getForecast } from "./actions/getForecast";
import { getWeatherAll, getWeatherDefault } from "./actions/getWeather";
import { listCities } from "./actions/listCities";
import { removeCity } from "./actions/removeCity";
import { setDefaultCity } from "./actions/setDefaultCity";
import { setUnit } from "./actions/setUnit";
import { ask, closeInput } from "./presentation/input";
import { renderMenu } from "./presentation/menu";
import { error } from "./presentation/output";
import { loadCities } from "./storage/citiesStorage";
import { loadSettings } from "./storage/settingsStorage";
import type { MenuRoutes } from "./types/MenuOption";

const routes: MenuRoutes = {
  "1": getWeatherDefault,
  "2": getWeatherAll,
  "3": addCity,
  "4": removeCity,
  "5": setDefaultCity,
  "6": getForecast,
  "7": listCities,
  "8": setUnit,
};

async function main(): Promise<void> {
  await loadCities();

  while (true) {
    const cities = await loadCities();
    const settings = await loadSettings();

    renderMenu({
      defaultCity: cities.defaultCity,
      cityCount: cities.cities.length,
      unit: settings.unit,
    });

    const option = (await ask("  Selecciona una opción: ")).trim();

    if (option === "9") {
      closeInput();
      console.log("  ¡Hasta luego!");
      break;
    }

    const action = routes[option];
    if (!action) {
      error(`  Opción inválida: "${option}"`);
      continue;
    }

    await action();
  }
}

main();
