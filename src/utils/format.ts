import type { Unit } from "../types/Weather";

export function formatTemp(tempC: number, unit: Unit): string {
  if (unit === "°F") {
    return `${(tempC * 9) / 5 + 32}°F`;
  }
  return `${tempC}°C`;
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`)
    .toLocaleDateString("es", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replace(",", "");
}
