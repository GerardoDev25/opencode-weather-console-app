import type { Unit } from "./Weather";

export interface MenuContext {
  defaultCity: string | null;
  cityCount: number;
  unit: Unit;
}

export interface MenuOption {
  key: string;
  label: string;
}

export type MenuAction = () => Promise<void>;

export type MenuRoutes = Record<string, MenuAction>;
