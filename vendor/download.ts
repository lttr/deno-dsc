// Vendored from https://deno.land/x/download@v1.0.0

export interface Destination {
  dir?: string;
  file?: string;
  mode?: number;
}

export interface DownloadedFile {
  file: string;
  dir: string;
  fullPath: string;
  size: number;
}

/** Download file from url to the destination. */
export async function download(
  url: string | URL,
  destination?: Destination,
  options?: RequestInit,
): Promise<DownloadedFile> {
  let file: string;
  let fullPath: string = "";
  let dir: string = "";
  let mode: Deno.WriteFileOptions = {};

  const response = await fetch(url, options);
  const finalUrl = response.url.replace(/\/$/, "");

  if (response.status !== 200) {
    throw new Deno.errors.Http(
      `status ${response.status}-'${response.statusText}' received instead of 200`,
    );
  }

  const blob = await response.blob();
  const size = blob.size;
  const buffer = await blob.arrayBuffer();
  const unit8arr = new Uint8Array(buffer);

  if (typeof destination === "undefined" || typeof destination.dir === "undefined") {
    dir = Deno.makeTempDirSync({ prefix: "deno_dwld" });
  } else {
    dir = destination.dir;
  }

  if (typeof destination === "undefined" || typeof destination.file === "undefined") {
    file = finalUrl.substring(finalUrl.lastIndexOf("/") + 1);
  } else {
    file = destination.file;
  }

  if (typeof destination !== "undefined" && typeof destination.mode !== "undefined") {
    mode = { mode: destination.mode };
  }

  dir = dir.replace(/\/$/, "");
  fullPath = `${dir}/${file}`;

  Deno.writeFileSync(fullPath, unit8arr, mode);

  return { file, dir, fullPath, size };
}
