import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { City } from "../../src/types/City";
import {
  defaultCitiesData,
  loadCities,
  saveCities,
} from "../../src/storage/citiesStorage";
import {
  CITIES_FILE,
  LEGACY_DATA_FILE,
  SETTINGS_FILE,
} from "../../src/utils/constants";
import { enterTempDir, leaveTempDir } from "../helpers";

const ottawa: City = {
  name: "Ottawa",
  country: "Canadá",
  latitude: 45.41117,
  longitude: -75.69812,
};

const toronto: City = {
  name: "Toronto",
  country: "Canadá",
  latitude: 43.6532,
  longitude: -79.3832,
};

beforeEach(() => {
  enterTempDir();
});

afterEach(() => {
  leaveTempDir();
});

describe("citiesStorage", () => {
  test("defaultCitiesData empieza vacío", () => {
    expect(defaultCitiesData()).toEqual({ cities: [], defaultCity: null });
  });

  test("loadCities devuelve los valores por defecto si no existe el archivo", async () => {
    expect(await loadCities()).toEqual({ cities: [], defaultCity: null });
  });

  test("saveCities y loadCities hacen roundtrip", async () => {
    const data = { cities: [ottawa, toronto], defaultCity: "Toronto" };

    await saveCities(data);

    expect(await loadCities()).toEqual(data);
  });

  test("loadCities completa un archivo parcial", async () => {
    writeFileSync(CITIES_FILE, JSON.stringify({ defaultCity: "Ottawa" }), "utf8");
    expect(await loadCities()).toEqual({ cities: [], defaultCity: "Ottawa" });

    writeFileSync(CITIES_FILE, JSON.stringify({ cities: [ottawa] }), "utf8");
    expect(await loadCities()).toEqual({ cities: [ottawa], defaultCity: null });
  });

  test("loadCities tolera JSON inválido", async () => {
    writeFileSync(CITIES_FILE, "{ ciudades: ", "utf8");

    expect(await loadCities()).toEqual({ cities: [], defaultCity: null });
  });

  test("migra data.json a cities.json y settings.json", async () => {
    writeFileSync(
      LEGACY_DATA_FILE,
      JSON.stringify({ cities: [ottawa], defaultCity: "Ottawa", unit: "°F" }),
      "utf8",
    );

    expect(await loadCities()).toEqual({ cities: [ottawa], defaultCity: "Ottawa" });
    expect(existsSync(CITIES_FILE)).toBe(true);
    expect(existsSync(LEGACY_DATA_FILE)).toBe(false);
    expect(readFileSync(SETTINGS_FILE, "utf8")).toBe(
      `${JSON.stringify({ unit: "°F" }, null, 2)}\n`,
    );
  });

  test("la migración usa Celsius cuando data.json no indica unidad", async () => {
    writeFileSync(
      LEGACY_DATA_FILE,
      JSON.stringify({ cities: [ottawa], defaultCity: "Ottawa" }),
      "utf8",
    );

    await loadCities();

    expect(readFileSync(SETTINGS_FILE, "utf8")).toBe(
      `${JSON.stringify({ unit: "°C" }, null, 2)}\n`,
    );
  });

  test("tolera un data.json inválido durante la migración", async () => {
    writeFileSync(LEGACY_DATA_FILE, "{ ciudades: ", "utf8");

    expect(await loadCities()).toEqual({ cities: [], defaultCity: null });
    expect(existsSync(CITIES_FILE)).toBe(false);
    expect(existsSync(LEGACY_DATA_FILE)).toBe(true);
  });

  test("no migra data.json si cities.json ya existe", async () => {
    writeFileSync(
      CITIES_FILE,
      JSON.stringify({ cities: [toronto], defaultCity: "Toronto" }),
      "utf8",
    );
    writeFileSync(
      LEGACY_DATA_FILE,
      JSON.stringify({ cities: [ottawa], defaultCity: "Ottawa", unit: "°F" }),
      "utf8",
    );

    expect(await loadCities()).toEqual({ cities: [toronto], defaultCity: "Toronto" });
    expect(existsSync(LEGACY_DATA_FILE)).toBe(true);
    expect(existsSync(SETTINGS_FILE)).toBe(false);
  });
});
