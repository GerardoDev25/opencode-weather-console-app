import { describe, expect, mock, spyOn, test } from "bun:test";
import { enterTempDir, leaveTempDir, stripAnsi } from "./helpers";

const answers: string[] = [];
let resolveClosed: () => void = () => {};
let closed = new Promise<void>((resolve) => {
  resolveClosed = resolve;
});

mock.module("../src/presentation/input.ts", () => ({
  ask: async () => answers.shift() ?? "9",
  readNumber: async () => null,
  readYesNo: async () => false,
  closeInput: () => resolveClosed(),
}));

describe("index", () => {
  test("muestra el menú, rechaza opciones inválidas y sale con la opción 9", async () => {
    enterTempDir();
    const logs: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      logs.push(stripAnsi(args.map(String).join(" ")));
    });

    answers.push("x", "7", "9");
    closed = new Promise<void>((resolve) => {
      resolveClosed = resolve;
    });

    try {
      await import("../src/index.ts");
      await closed;
    } finally {
      spy.mockRestore();
      leaveTempDir();
    }

    expect(logs.join("\n")).toContain('Opción inválida: "x"');
    expect(logs.join("\n")).toContain("No hay ciudades guardadas.");
    expect(logs.join("\n")).toContain("¡Hasta luego!");
    expect(logs.join("\n")).toContain("WEATHER CLI");
  }, 5000);
});
