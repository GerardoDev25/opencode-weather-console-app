const enabled = process.stdout.isTTY === true;

function wrap(code: number, text: string): string {
  return enabled ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export function cyan(text: string): string {
  return wrap(36, text);
}

export function yellow(text: string): string {
  return wrap(33, text);
}

export function green(text: string): string {
  return wrap(32, text);
}

export function red(text: string): string {
  return wrap(31, text);
}

export function bold(text: string): string {
  return wrap(1, text);
}
