import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import { loadCities, saveCities } from "../../src/storage/citiesStorage";
import type { City } from "../../src/types/City";
import { enterTempDir, leaveTempDir, stripAnsi } from "../helpers";

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

let readNumberImpl: (text: string) => Promise<number | null> = async () => null;

mock.module("../../src/presentation/input.ts", () => ({
  ask: async () => "",
  readNumber: (text: string) => readNumberImpl(text),
  readYesNo: async () => false,
  closeInput: () => {},
}));

let setDefaultCity: (typeof import("../../src/actions/setDefaultCity.ts"))["setDefaultCity"];

beforeAll(async () => {
  ({ setDefaultCity } = await import("../../src/actions/setDefaultCity.ts"));
});

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
  readNumberImpl = async () => null;
  leaveTempDir();
});

describe("setDefaultCity", () => {
  test("avisa cuando no hay ciudades guardadas", async () => {
    await setDefaultCity();

    expect(logs.join("\n")).toContain("No hay ciudades guardadas.");
  });

  test("establece la ciudad default", async () => {
    await saveCities({ cities: [ottawa, toronto], defaultCity: "Ottawa" });
    readNumberImpl = async () => 2;

    await setDefaultCity();

    expect((await loadCities()).defaultCity).toBe("Toronto");
  });

  test("no cambia la default si se cancela", async () => {
    await saveCities({ cities: [ottawa, toronto], defaultCity: "Ottawa" });
    readNumberImpl = async () => 0;

    await setDefaultCity();

    expect((await loadCities()).defaultCity).toBe("Ottawa");
  });

  test("rechaza un número inválido", async () => {
    await saveCities({ cities: [ottawa], defaultCity: "Ottawa" });
    readNumberImpl = async () => 9;

    await setDefaultCity();

    expect((await loadCities()).defaultCity).toBe("Ottawa");
  });
});
