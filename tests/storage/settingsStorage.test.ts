import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync, writeFileSync } from "node:fs";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
} from "../../src/storage/settingsStorage";
import { SETTINGS_FILE } from "../../src/utils/constants";
import { enterTempDir, leaveTempDir } from "../helpers";

beforeEach(() => {
  enterTempDir();
});

afterEach(() => {
  leaveTempDir();
});

describe("settingsStorage", () => {
  test("defaultSettings usa grados Celsius", () => {
    expect(defaultSettings()).toEqual({ unit: "°C" });
  });

  test("loadSettings devuelve los valores por defecto si no existe el archivo", async () => {
    expect(await loadSettings()).toEqual({ unit: "°C" });
  });

  test("saveSettings y loadSettings hacen roundtrip", async () => {
    await saveSettings({ unit: "°F" });
    expect(await loadSettings()).toEqual({ unit: "°F" });

    await saveSettings({ unit: "°C" });
    expect(await loadSettings()).toEqual({ unit: "°C" });
  });

  test("saveSettings escribe JSON con indentación y salto de línea", async () => {
    await saveSettings({ unit: "°F" });

    expect(readFileSync(SETTINGS_FILE, "utf8")).toBe(
      `${JSON.stringify({ unit: "°F" }, null, 2)}\n`,
    );
  });

  test("loadSettings tolera JSON inválido", async () => {
    writeFileSync(SETTINGS_FILE, "{ unidad: ", "utf8");

    expect(await loadSettings()).toEqual({ unit: "°C" });
  });

  test("loadSettings normaliza una unidad desconocida a Celsius", async () => {
    writeFileSync(SETTINGS_FILE, JSON.stringify({ unit: "K" }), "utf8");

    expect(await loadSettings()).toEqual({ unit: "°C" });
  });
});
