import readline from 'node:readline/promises';
import { cyan, bold } from './colors';
import type { Store } from './types';

const LINE = cyan('═'.repeat(40));
const TITLE = bold(cyan('         WEATHER CLI'));

export function formatTemp(tempC: number, unit: '°C' | '°F'): string {
  if (unit === '°F') {
    return `${(tempC * 9) / 5 + 32}°F`;
  }
  return `${tempC}°C`;
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`)
    .toLocaleDateString('es', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    .replace(',', '');
}

export function renderMenu(store: Store): void {
  console.log();
  console.log(LINE);
  console.log(TITLE);
  console.log(LINE);
  console.log(
    `  1. Clima de ciudad default${store.defaultCity ? ` (${store.defaultCity})` : ''}`,
  );
  console.log(`  2. Clima de todas las ciudades (${store.cities.length})`);
  console.log('  3. Buscar y agregar ciudad');
  console.log('  4. Eliminar ciudad');
  console.log('  5. Establecer ciudad default');
  console.log(
    `  6. Pronóstico 7 días${store.defaultCity ? ` (${store.defaultCity})` : ''}`,
  );
  console.log(`  8. Ajustes (${store.unit})`);
  console.log('  9. Salir');
  console.log(LINE);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(text: string): Promise<string> {
  return rl.question(cyan(text));
}

export function closeUi(): void {
  rl.close();
}
