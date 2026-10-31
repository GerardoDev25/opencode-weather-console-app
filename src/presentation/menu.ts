import type { MenuContext, MenuOption } from "../types/MenuOption";
import { bold, cyan } from "../utils/colors";
import { APP_TITLE, MENU_WIDTH } from "../utils/constants";

const LINE = cyan("═".repeat(MENU_WIDTH));
const TITLE = bold(cyan(APP_TITLE));

const OPTIONS: Array<{ key: string; label: (context: MenuContext) => string }> = [
  {
    key: "1",
    label: (context) =>
      `Clima de ciudad default${context.defaultCity ? ` (${context.defaultCity})` : ""}`,
  },
  {
    key: "2",
    label: (context) => `Clima de todas las ciudades (${context.cityCount})`,
  },
  { key: "3", label: () => "Buscar y agregar ciudad" },
  { key: "4", label: () => "Eliminar ciudad" },
  { key: "5", label: () => "Establecer ciudad default" },
  {
    key: "6",
    label: (context) =>
      `Pronóstico 7 días${context.defaultCity ? ` (${context.defaultCity})` : ""}`,
  },
  { key: "7", label: () => "Listar ciudades guardadas" },
  { key: "8", label: (context) => `Ajustes (${context.unit})` },
  { key: "9", label: () => "Salir" },
];

export function getMenuOptions(context: MenuContext): MenuOption[] {
  return OPTIONS.map((option) => ({
    key: option.key,
    label: option.label(context),
  }));
}

export function renderMenu(context: MenuContext): void {
  console.log();
  console.log(LINE);
  console.log(TITLE);
  console.log(LINE);

  for (const option of getMenuOptions(context)) {
    console.log(`  ${option.key}. ${option.label}`);
  }

  console.log(LINE);
}
