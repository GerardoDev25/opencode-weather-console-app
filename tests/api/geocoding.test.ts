import { afterEach, describe, expect, test } from "bun:test";
import { findCity } from "../../src/api/geocoding";
import { jsonResponse, mockFetch } from "../helpers";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("findCity", () => {
  test("consulta la API de geocoding y mapea el resultado", async () => {
    const calls = mockFetch(() =>
      jsonResponse({
        results: [
          {
            name: "Ottawa",
            country: "Canadá",
            latitude: 45.41117,
            longitude: -75.69812,
          },
        ],
      }),
    );

    const city = await findCity("New York");

    expect(calls).toEqual([
      "https://geocoding-api.open-meteo.com/v1/search?name=New%20York&count=1&language=es&format=json",
    ]);
    expect(city).toEqual({
      name: "Ottawa",
      country: "Canadá",
      latitude: 45.41117,
      longitude: -75.69812,
    });
  });

  test("devuelve null si la API no encuentra resultados", async () => {
    mockFetch(() => jsonResponse({ results: [] }));
    expect(await findCity("Ciudad Inexistente")).toBeNull();

    mockFetch(() => jsonResponse({}));
    expect(await findCity("Ciudad Inexistente")).toBeNull();
  });

  test("propaga un error HTTP con el código de estado", async () => {
    mockFetch(() => jsonResponse({ error: true }, 503));

    await expect(findCity("Ottawa")).rejects.toThrow(
      "Error de geocoding (HTTP 503)",
    );
  });

  test("propaga errores de red", async () => {
    mockFetch(() => {
      throw new Error("sin conexión");
    });

    await expect(findCity("Ottawa")).rejects.toThrow("sin conexión");
  });
});
