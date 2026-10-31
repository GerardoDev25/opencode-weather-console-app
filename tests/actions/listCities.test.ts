import {
  afterEach,
  beforeEach,
  describe,
  expect,
  spyOn,
  test,
} from "bun:test";
import { listCities } from "../../src/actions/listCities";
import { saveCities } from "../../src/storage/citiesStorage";
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
  leaveTempDir();
});

describe("listCities", () => {
  test("lista las ciudades y marca la default", async () => {
    await saveCities({ cities: [ottawa, toronto], defaultCity: "Ottawa" });

    await listCities();

    expect(logs.join("\n")).toContain("Ciudades guardadas (2):");
    expect(logs.join("\n")).toContain("Ottawa, Canadá (default)");
    expect(logs.join("\n")).toContain("Toronto, Canadá");
  });

  test("avisa cuando no hay ciudades", async () => {
    await listCities();

    expect(logs.join("\n")).toContain("No hay ciudades guardadas.");
  });
});
