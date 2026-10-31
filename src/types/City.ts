export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CitiesData {
  cities: City[];
  defaultCity: string | null;
}
