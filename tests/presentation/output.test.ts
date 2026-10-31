import { describe, expect, spyOn, test } from "bun:test";
import type { City } from "../../src/types/City";
import type { DailyForecast } from "../../src/types/Weather";
import {
  error,
  showCities,
  showForecast,
  showWeather,
  success,
} from "../../src/presentation/output";
import { stripAnsi } from "../helpers";

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

function capture(action: () => void): string[] {
  const lines: string[] = [];
  const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    lines.push(stripAnsi(args.map(String).join(" ")));
  });

  try {
    action();
  } finally {
    spy.mockRestore();
  }

  return lines;
}

describe("output", () => {
  test("success y error imprimen el mensaje", () => {
    expect(capture(() => success("todo bien"))).toEqual(["todo bien"]);
    expect(capture(() => error("algo falló"))).toEqual(["algo falló"]);
  });

  test("showWeather muestra ciudad, país y temperatura", () => {
    expect(capture(() => showWeather(ottawa, 10, "°C"))).toEqual([
      "  Ottawa, Canadá: 10°C",
    ]);
    expect(capture(() => showWeather(ottawa, 10, "°F"))).toEqual([
      "  Ottawa, Canadá: 50°F",
    ]);
  });

  test("showCities marca la ciudad default", () => {
    expect(capture(() => showCities([ottawa, toronto], "Ottawa"))).toEqual([
      "  1. Ottawa, Canadá (default)",
      "  2. Toronto, Canadá",
    ]);
  });

  test("showCities funciona sin ciudad default", () => {
    expect(capture(() => showCities([ottawa], null))).toEqual([
      "  1. Ottawa, Canadá",
    ]);
  });

  test("showForecast imprime el encabezado y una fila por día", () => {
    const daily: DailyForecast = {
      time: ["2026-10-31", "2026-11-01"],
      temperature_2m_max: [20, 18],
      temperature_2m_min: [10, 8],
      precipitation_sum: [0, 2.5],
      wind_speed_10m_max: [12, 20],
    };

    const lines = capture(() => showForecast(ottawa, daily, "°C"));

    expect(lines[1]).toBe("  Pronóstico 7 días: Ottawa, Canadá (°C)");
    expect(lines[2]).toContain("Fecha");
    expect(lines[3]).toContain("10°C");
    expect(lines[3]).toContain("20°C");
    expect(lines[3]).toContain("0 mm");
    expect(lines[3]).toContain("12 km/h");
    expect(lines[4]).toContain("8°C");
    expect(lines[4]).toContain("2.5 mm");
    expect(lines[4]).toContain("20 km/h");
  });

  test("showForecast ignora días con datos incompletos", () => {
    const daily: DailyForecast = {
      time: ["2026-10-31"],
      temperature_2m_max: [],
      temperature_2m_min: [],
      precipitation_sum: [],
      wind_speed_10m_max: [],
    };

    expect(capture(() => showForecast(ottawa, daily, "°C"))).toHaveLength(3);
  });
});
