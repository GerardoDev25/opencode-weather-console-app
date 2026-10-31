import type { City } from "../types/City";
import type { DailyForecast, Unit } from "../types/Weather";
import { green, red, yellow } from "../utils/colors";
import { formatDate, formatTemp } from "../utils/format";

export function success(message: string): void {
  console.log(green(message));
}

export function error(message: string): void {
  console.log(red(message));
}

export function showWeather(city: City, tempC: number, unit: Unit): void {
  console.log(`  ${city.name}, ${city.country}: ${yellow(formatTemp(tempC, unit))}`);
}

export function showCities(cities: City[], defaultCity: string | null): void {
  cities.forEach((city, index) => {
    const label =
      city.name === defaultCity
        ? `${city.name}, ${city.country} (default)`
        : `${city.name}, ${city.country}`;
    console.log(`  ${index + 1}. ${label}`);
  });
}

export function showForecast(city: City, daily: DailyForecast, unit: Unit): void {
  console.log();
  console.log(`  Pronóstico 7 días: ${city.name}, ${city.country} (${unit})`);
  console.log(
    `  ${"Fecha".padEnd(12)}${"Min".padStart(7)}${"Max".padStart(7)}${"Lluvia".padStart(10)}${"Viento".padStart(11)}`,
  );

  for (let i = 0; i < daily.time.length; i++) {
    const date = daily.time[i];
    const min = daily.temperature_2m_min[i];
    const max = daily.temperature_2m_max[i];
    const rain = daily.precipitation_sum[i];
    const wind = daily.wind_speed_10m_max[i];
    if (date === undefined || min === undefined || max === undefined || rain === undefined || wind === undefined) {
      continue;
    }

    console.log(
      `  ${formatDate(date).padEnd(12)}${formatTemp(min, unit).padStart(7)}${formatTemp(max, unit).padStart(7)}${`${rain} mm`.padStart(10)}${`${wind} km/h`.padStart(11)}`,
    );
  }
}
