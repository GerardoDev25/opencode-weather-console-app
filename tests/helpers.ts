import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;

let originalCwd = "";
let tempDir = "";

export function stripAnsi(text: string): string {
  return text.replace(ANSI_PATTERN, "");
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function mockFetch(
  handler: (url: string) => Response | Promise<Response>,
): string[] {
  const calls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request): Promise<Response> => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    calls.push(url);
    return handler(url);
  }) as typeof fetch;

  return calls;
}

export function enterTempDir(): string {
  originalCwd = process.cwd();
  tempDir = mkdtempSync(join(tmpdir(), "weather-cli-test-"));
  process.chdir(tempDir);
  return tempDir;
}

export function leaveTempDir(): void {
  if (originalCwd) {
    process.chdir(originalCwd);
  }
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
  }

  originalCwd = "";
  tempDir = "";
}
