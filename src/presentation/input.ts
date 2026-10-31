import readline from "node:readline/promises";
import { cyan } from "../utils/colors";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(text: string): Promise<string> {
  return rl.question(cyan(text));
}

export async function readNumber(text: string): Promise<number | null> {
  const answer = (await ask(text)).trim();
  if (answer === "") {
    return null;
  }

  const num = Number(answer);
  if (Number.isNaN(num) || !Number.isInteger(num)) {
    return null;
  }

  return num;
}

export async function readYesNo(text: string): Promise<boolean> {
  const answer = (await ask(text)).trim().toLowerCase();
  return answer === "s" || answer === "si" || answer === "sí";
}

export function closeInput(): void {
  rl.close();
}
