import {
  afterEach,
  beforeEach,
  describe,
  expect,
  spyOn,
  test,
} from "bun:test";
import {
  getWeatherAll,
  getWeatherDefault,
  resolveDefaultCity,
} from "../../src/actions/getWeather";
import { saveCities } from "../../src/storage/citiesStorage";
import type { City } from "../../src/types/City";
import {
  enterTempDir,
  jsonResponse,
  leaveTempDir,
  mockFetch,
  stripAnsi,
} from "../helpers";

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

const originalFetch = globalThis.fetch;

let logs: string[] = [];
let restoreLog: () => void = () => {};

beforeEach(() => {
  enterTempDir();
  logs = [];
  const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    logs.push(stripAnsi(args.map(String).join(" ")));
  });
  restoreLog = () => spy.mockRestore();
});

afterEach(() => {
  restoreLog();
  globalThis.fetch = originalFetch;
  leaveTempDir();
});

describe("resolveDefaultCity", () => {
  test("devuelve la ciudad default guardada", () => {
    expect(resolveDefaultCity({ cities: [ottawa], defaultCity: "Ottawa" })).toEqual(
      ottawa,
    );
  });

  test("devuelve null si no hay ciudad default", () => {
    expect(resolveDefaultCity({ cities: [ottawa], defaultCity: null })).toBeNull();
  });

  test("devuelve null si la default no está en la lista", () => {
    expect(resolveDefaultCity({ cities: [ottawa], defaultCity: "Lima" })).toBeNull();
  });
});

describe("getWeatherDefault", () => {
  test("consulta el clima de la ciudad default", async () => {
    await saveCities({ cities: [ottawa], defaultCity: "Ottawa" });
    const calls = mockFetch(() =>
      jsonResponse({ current: { temperature_2m: 12 } }),
    );

    await getWeatherDefault();

    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain("latitude=45.41117");
    expect(calls[0]).toContain("longitude=-75.69812");
    expect(logs.join("\n")).toContain("Ottawa, Canadá: 12°C");
  });

  test("no consulta nada sin ciudad default", async () => {
    const calls = mockFetch(() => jsonResponse({}));

    await getWeatherDefault();

    expect(calls).toHaveLength(0);
    expect(logs.join("\n")).toContain("No hay ciudad default.");
  });

  test("avisa si falla la conexión con OpenMeteo", async () => {
    await saveCities({ cities: [ottawa], defaultCity: "Ottawa" });
    mockFetch(() => {
      throw new Error("sin conexión");
    });

    await getWeatherDefault();

    expect(logs.join("\n")).toContain(
      "No se pudo contactar a OpenMeteo. Verifica tu conexión.",
    );
  });
});

describe("getWeatherAll", () => {
  test("consulta todas las ciudades aunque una falle", async () => {
    await saveCities({ cities: [ottawa, toronto], defaultCity: "Ottawa" });
    const calls = mockFetch((url) =>
      url.includes("latitude=45.41117")
        ? jsonResponse({ current: { temperature_2m: 12 } })
        : jsonResponse({ error: true }, 500),
    );

    await getWeatherAll();

    expect(calls).toHaveLength(2);
    expect(logs.join("\n")).toContain("Ottawa, Canadá: 12°C");
    expect(logs.join("\n")).toContain("Toronto: error al consultar el clima");
  });

  test("avisa cuando no hay ciudades", async () => {
    const calls = mockFetch(() => jsonResponse({}));

    await getWeatherAll();

    expect(calls).toHaveLength(0);
    expect(logs.join("\n")).toContain("No hay ciudades guardadas.");
  });
});
