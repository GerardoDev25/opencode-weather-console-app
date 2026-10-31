import { describe, expect, test } from "bun:test";
import { formatDate, formatTemp } from "../../src/utils/format";

describe("formatTemp", () => {
  test("mantiene la temperatura en grados Celsius", () => {
    expect(formatTemp(20, "°C")).toBe("20°C");
    expect(formatTemp(-3.5, "°C")).toBe("-3.5°C");
  });

  test("convierte la temperatura a grados Fahrenheit", () => {
    expect(formatTemp(0, "°F")).toBe("32°F");
    expect(formatTemp(100, "°F")).toBe("212°F");
    expect(formatTemp(-40, "°F")).toBe("-40°F");
    expect(formatTemp(25, "°F")).toBe("77°F");
  });
});

describe("formatDate", () => {
  test("formatea una fecha ISO en español", () => {
    expect(formatDate("2026-10-31")).toBe("sáb 31 oct");
    expect(formatDate("2026-01-01")).toBe("jue 1 ene");
  });
});
