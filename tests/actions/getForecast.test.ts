import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { getForecast } from '../../src/actions/getForecast';
import { saveCities } from '../../src/storage/citiesStorage';
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
  leaveTempDir();
});

describe('getForecast', () => {
  test('consulta el pronóstico de la ciudad default', async () => {
    await saveCities({ cities: [ottawa], defaultCity: 'Ottawa' });
    const calls = mockFetch(() =>
      jsonResponse({
        daily: {
          time: ['2026-10-31'],
          temperature_2m_max: [20],
          temperature_2m_min: [10],
          precipitation_sum: [0],
          wind_speed_10m_max: [12],
        },
      }),
    );

    await getForecast();

    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('forecast_days=7');
    expect(logs.join('\n')).toContain('Pronóstico 7 días: Ottawa, Canadá');
  });

  test('no consulta nada sin ciudad default', async () => {
    const calls = mockFetch(() => jsonResponse({}));

    await getForecast();

    expect(calls).toHaveLength(0);
    expect(logs.join('\n')).toContain('No hay ciudad default.');
  });

  test('avisa si falla la conexión con OpenMeteo', async () => {
    await saveCities({ cities: [ottawa], defaultCity: 'Ottawa' });
    mockFetch(() => {
      throw new Error('sin conexión');
    });

    await getForecast();

    expect(logs.join('\n')).toContain(
      'No se pudo contactar a OpenMeteo. Verifica tu conexión.',
    );
  });
});
