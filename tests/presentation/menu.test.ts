import { describe, expect, spyOn, test } from "bun:test";
import { getMenuOptions, renderMenu } from "../../src/presentation/menu";
import type { MenuContext } from "../../src/types/MenuOption";
import { stripAnsi } from "../helpers";

function labels(context: MenuContext): string[] {
  return getMenuOptions(context).map((option) => option.label);
}

describe("getMenuOptions", () => {
  test("devuelve las nueve opciones en el orden esperado", () => {
    const options = getMenuOptions({ defaultCity: null, cityCount: 0, unit: "°C" });

    expect(options.map((option) => option.key)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    expect(options.map((option) => option.label)).toEqual([
      "Clima de ciudad default",
      "Clima de todas las ciudades (0)",
      "Buscar y agregar ciudad",
      "Eliminar ciudad",
      "Establecer ciudad default",
      "Pronóstico 7 días",
      "Listar ciudades guardadas",
      "Ajustes (°C)",
      "Salir",
    ]);
  });

  test("incluye la ciudad default y la cantidad de ciudades", () => {
    const options = labels({ defaultCity: "Ottawa", cityCount: 3, unit: "°F" });

    expect(options[0]).toBe("Clima de ciudad default (Ottawa)");
    expect(options[1]).toBe("Clima de todas las ciudades (3)");
    expect(options[5]).toBe("Pronóstico 7 días (Ottawa)");
    expect(options[7]).toBe("Ajustes (°F)");
  });

  test("renderMenu imprime el marco, el título y todas las opciones", () => {
    const lines: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(stripAnsi(args.map(String).join(" ")));
    });

    try {
      renderMenu({ defaultCity: "Ottawa", cityCount: 3, unit: "°F" });
    } finally {
      spy.mockRestore();
    }

    expect(lines).toHaveLength(14);
    expect(lines[0]).toBe("");
    expect(lines[1]).toBe("═".repeat(40));
    expect(lines[2]).toContain("WEATHER CLI");
    expect(lines[3]).toBe("═".repeat(40));
    expect(lines[4]).toBe("  1. Clima de ciudad default (Ottawa)");
    expect(lines[12]).toBe("  9. Salir");
    expect(lines[13]).toBe("═".repeat(40));
  });
});
