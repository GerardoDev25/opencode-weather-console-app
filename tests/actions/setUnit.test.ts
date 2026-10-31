import {
  afterEach,
  beforeEach,
  describe,
  expect,
  spyOn,
  test,
} from "bun:test";
import { setUnit } from "../../src/actions/setUnit";
import { loadSettings } from "../../src/storage/settingsStorage";
import { enterTempDir, leaveTempDir } from "../helpers";

let restoreLog: () => void = () => {};

beforeEach(() => {
  enterTempDir();
  const spy = spyOn(console, "log").mockImplementation(() => {});
  restoreLog = () => spy.mockRestore();
});

afterEach(() => {
  restoreLog();
  leaveTempDir();
});

describe("setUnit", () => {
  test("alterna entre Celsius y Fahrenheit", async () => {
    await setUnit();
    expect((await loadSettings()).unit).toBe("°F");

    await setUnit();
    expect((await loadSettings()).unit).toBe("°C");
  });
});
