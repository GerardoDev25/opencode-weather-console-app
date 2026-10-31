import { afterEach, describe, expect, test } from "bun:test";
import { currentTemperatureC, forecastWeekC } from "../../src/api/weather";
import type { DailyForecast } from "../../src/types/Weather";
import { jsonResponse, mockFetch } from "../helpers";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const daily: DailyForecast = {
  time: ["2026-10-31", "2026-11-01"],
  temperature_2m_max: [20, 18],
  temperature_2m_min: [10, 8],
  precipitation_sum: [0, 2.5],
  wind_speed_10m_max: [12, 20],
};

describe("currentTemperatureC", () => {
  test("consulta la temperatura actual", async () => {
    const calls = mockFetch(() =>
      jsonResponse({ current: { temperature_2m: 12.5 } }),
    );

    expect(await currentTemperatureC(45.41117, -75.69812)).toBe(12.5);
    expect(calls).toEqual([
      "https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m",
    ]);
  });

  test("falla si la respuesta no incluye la temperatura", async () => {
    mockFetch(() => jsonResponse({ current: {} }));

    await expect(currentTemperatureC(1, 2)).rejects.toThrow(
      "La respuesta de OpenMeteo no incluye la temperatura",
    );
  });

  test("propaga un error HTTP con el código de estado", async () => {
    mockFetch(() => jsonResponse({ error: true }, 500));

    await expect(currentTemperatureC(1, 2)).rejects.toThrow(
      "Error al obtener el clima (HTTP 500)",
    );
  });
});

describe("forecastWeekC", () => {
  test("consulta el pronóstico de siete días", async () => {
    const calls = mockFetch(() => jsonResponse({ daily }));

    expect(await forecastWeekC(45.41117, -75.69812)).toEqual(daily);
    expect(calls).toEqual([
      "https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=7",
    ]);
  });

  test("falla si la respuesta no incluye el pronóstico diario", async () => {
    mockFetch(() => jsonResponse({}));

    await expect(forecastWeekC(1, 2)).rejects.toThrow(
      "La respuesta de OpenMeteo no incluye el pronóstico diario",
    );
  });

  test("propaga un error HTTP con el código de estado", async () => {
    mockFetch(() => jsonResponse({ error: true }, 502));

    await expect(forecastWeekC(1, 2)).rejects.toThrow(
      "Error al obtener el pronóstico (HTTP 502)",
    );
  });
});
