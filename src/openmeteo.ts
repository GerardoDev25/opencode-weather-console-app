import type { City, DailyForecast, ForecastResponse, GeocodingResponse } from "./types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function findCity(name: string): Promise<City | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error de geocoding (HTTP ${res.status})`);
  }

  const data = (await res.json()) as GeocodingResponse;
  const result = data.results?.[0];
  if (!result) {
    return null;
  }

  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

export async function currentTemperatureC(lat: number, lon: number): Promise<number> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al obtener el clima (HTTP ${res.status})`);
  }

  const data = (await res.json()) as ForecastResponse;
  const temp = data.current?.temperature_2m;
  if (temp === undefined) {
    throw new Error("La respuesta de OpenMeteo no incluye la temperatura");
  }

  return temp;
}

export async function forecastWeekC(lat: number, lon: number): Promise<DailyForecast> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al obtener el pronóstico (HTTP ${res.status})`);
  }

  const data = (await res.json()) as ForecastResponse;
  const daily = data.daily;
  if (!daily) {
    throw new Error("La respuesta de OpenMeteo no incluye el pronóstico diario");
  }

  return daily;
}
