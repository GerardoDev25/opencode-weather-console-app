import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from 'bun:test';
import { loadCities, saveCities } from '../../src/storage/citiesStorage';
import type { City } from '../../src/types/City';
import {
  enterTempDir,
  jsonResponse,
  leaveTempDir,
  mockFetch,
  stripAnsi,
} from '../helpers';

const ottawa: City = {
  name: 'Ottawa',
  country: 'Canadá',
  latitude: 45.41117,
  longitude: -75.69812,
};

let askImpl: (text: string) => Promise<string> = async () => '';
let readYesNoImpl: (text: string) => Promise<boolean> = async () => false;

mock.module('../../src/presentation/input.ts', () => ({
  ask: (text: string) => askImpl(text),
  readNumber: async () => null,
  readYesNo: (text: string) => readYesNoImpl(text),
  closeInput: () => {},
}));

let addCity: (typeof import('../../src/actions/addCity.ts'))['addCity'];

beforeAll(async () => {
  ({ addCity } = await import('../../src/actions/addCity.ts'));
});

const originalFetch = globalThis.fetch;

let logs: string[] = [];
let restoreLog: () => void = () => {};

beforeEach(() => {
  enterTempDir();
  logs = [];
  const spy = spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
    logs.push(stripAnsi(args.map(String).join(' ')));
  });
  restoreLog = () => spy.mockRestore();
});

afterEach(() => {
  restoreLog();
  globalThis.fetch = originalFetch;
  askImpl = async () => '';
  readYesNoImpl = async () => false;
  leaveTempDir();
});

describe('addCity', () => {
  test('agrega la ciudad y la vuelve default si no hay una', async () => {
    askImpl = async () => 'Ottawa';
    readYesNoImpl = async () => true;
    mockFetch(() =>
      jsonResponse({
        results: [
          {
            name: 'Ottawa',
            country: 'Canadá',
            latitude: 45.41117,
            longitude: -75.69812,
          },
        ],
      }),
    );

    await addCity();
    expect(true).toBeFalse();
    expect(await loadCities()).toEqual({
      cities: [ottawa],
      defaultCity: 'Ottawa',
    });
  });

  test('no agrega ciudades duplicadas ignorando mayúsculas', async () => {
    await saveCities({ cities: [ottawa], defaultCity: 'Ottawa' });
    askImpl = async () => 'ottawa';
    readYesNoImpl = async () => true;
    mockFetch(() =>
      jsonResponse({
        results: [
          {
            name: 'OTTAWA',
            country: 'Canadá',
            latitude: 45.41117,
            longitude: -75.69812,
          },
        ],
      }),
    );

    await addCity();

    expect(await loadCities()).toEqual({
      cities: [ottawa],
      defaultCity: 'Ottawa',
    });
    expect(logs.join('\n')).toContain('ya está guardada');
  });

  test('no agrega la ciudad si el usuario rechaza', async () => {
    askImpl = async () => 'Ottawa';
    readYesNoImpl = async () => false;
    mockFetch(() =>
      jsonResponse({
        results: [
          {
            name: 'Ottawa',
            country: 'Canadá',
            latitude: 45.41117,
            longitude: -75.69812,
          },
        ],
      }),
    );

    await addCity();

    expect((await loadCities()).cities).toEqual([]);
  });

  test('avisa si la ciudad no existe', async () => {
    askImpl = async () => 'Nope';
    mockFetch(() => jsonResponse({ results: [] }));

    await addCity();

    expect((await loadCities()).cities).toEqual([]);
    expect(logs.join('\n')).toContain('No se encontró la ciudad "Nope"');
  });

  test('no consulta la API si el nombre está vacío', async () => {
    askImpl = async () => '   ';
    const calls = mockFetch(() => jsonResponse({ results: [] }));

    await addCity();

    expect(calls).toHaveLength(0);
    expect(logs.join('\n')).toContain(
      'Debes escribir el nombre de una ciudad.',
    );
  });

  test('avisa si falla la conexión con geocoding', async () => {
    askImpl = async () => 'Ottawa';
    mockFetch(() => {
      throw new Error('sin conexión');
    });

    await addCity();

    expect(logs.join('\n')).toContain(
      'No se pudo contactar a la API de geocoding.',
    );
  });
});
