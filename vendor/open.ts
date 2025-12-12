// Vendored from https://deno.land/x/open@v0.0.5 and updated for Deno 2

const { os } = Deno.build;

export interface OpenOptions {
  /**
   * Wait for the opened app to exit before fulfilling the promise.
   * @default false
   */
  readonly wait?: boolean;

  /**
   * __macOS only__
   * Do not bring the app to the foreground.
   * @default false
   */
  readonly background?: boolean;

  /**
   * Specify the app to open the target with.
   */
  app?: string | string[];

  /**
   * Uses encodeURI to encode the target before executing it.
   * @default false
   */
  readonly url?: boolean;
}

export async function open(
  target: string,
  options?: OpenOptions,
): Promise<void> {
  if (typeof target !== "string") {
    throw new TypeError("Expected a target");
  }

  const opts = {
    wait: false,
    background: false,
    url: false,
    ...options,
  };

  let command: string;
  let appArguments: string[] = [];
  const cliArguments: string[] = [];

  if (Array.isArray(opts.app)) {
    appArguments = opts.app.slice(1);
    opts.app = opts.app[0];
  }

  if (opts.url) {
    target = encodeURI(target);
  }

  if (os === "darwin") {
    command = "open";

    if (opts.wait) {
      cliArguments.push("--wait-apps");
    }

    if (opts.background) {
      cliArguments.push("--background");
    }

    if (opts.app) {
      cliArguments.push("-a", opts.app);
    }
  } else if (os === "windows") {
    command = "cmd";
    cliArguments.push("/s", "/c", "start", "", "/b");

    if (opts.wait) {
      cliArguments.push("/wait");
    }

    if (opts.app) {
      cliArguments.push(opts.app);
    }

    if (appArguments.length > 0) {
      cliArguments.push(...appArguments);
    }
  } else {
    // Linux
    if (opts.app) {
      command = opts.app;
    } else {
      command = "xdg-open";
    }

    if (appArguments.length > 0) {
      cliArguments.push(...appArguments);
    }
  }

  cliArguments.push(target);

  if (os === "darwin" && appArguments.length > 0) {
    cliArguments.push("--args", ...appArguments);
  }

  const cmd = new Deno.Command(command, {
    args: cliArguments,
    stdin: "null",
    stdout: "null",
    stderr: "piped",
  });

  const child = cmd.spawn();

  if (opts.wait) {
    const output = await child.output();
    if (!output.success) {
      const error = new TextDecoder().decode(output.stderr);
      throw new Error(error || `Exited with code ${output.code}`);
    }
  }
}
