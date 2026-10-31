import type { City } from "../types/City";
import type { GeocodingResponse } from "../types/Weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

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
