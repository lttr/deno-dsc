import { deno } from "../deps.ts";

interface CommandOptions {
  stdin?: string;
  suppressError?: boolean;
}
export async function command(
  params: string[],
  { stdin, suppressError }: CommandOptions = {},
): Promise<{
  success: boolean;
  code: number;
  output: string;
}> {
  const runOptions: any = {
    cmd: params,
    stdout: "piped",
  };
  if (stdin) {
    runOptions.stdin = "piped";
  }
  if (suppressError) {
    runOptions.stderr = "null";
  }
  const process = deno.run(runOptions);
  if (stdin) {
    const writer = process.stdin?.writable.getWriter();
    await writer?.write(new TextEncoder().encode(stdin));
    process.stdin?.close();
  }
  const { success, code } = await process.status();
  const stdout = await process.output();
  const output = new TextDecoder().decode(stdout).trim();
  process.close();
  return { success, code, output };
}
