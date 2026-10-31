export type Unit = "°C" | "°F";

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Store {
  cities: City[];
  defaultCity: string | null;
  unit: Unit;
}

export interface GeocodingResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}

export interface ForecastResponse {
  current?: {
    temperature_2m: number;
  };
  daily?: DailyForecast;
}
