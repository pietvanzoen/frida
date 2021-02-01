import {
  parse,
  isValid,
} from "https://deno.land/x/date_fns/index.js";
import {
  initializeImageMagick,
  ImageMagick,
  MagickImage,
  MagickFormat,
} from "https://raw.githubusercontent.com/leonelv/deno-imagemagick/master/mod.ts";
import { resolve, dirname } from "https://deno.land/std/path/mod.ts";
import { ensureDir, existsSync, copy } from "https://deno.land/std/fs/mod.ts";

import exifer from "https://cdn.pika.dev/exifer@^1.0.0-beta.2";
import Buffer from "https://deno.land/std/node/buffer.ts";

let magicInitialized = false; // make sure to initialize first!

const DIST = "./dist";
const CACHE = "./.cache";

export async function buildOptimizedPhoto(path: string) {
  if (!magicInitialized) {
    await initializeImageMagick();
    magicInitialized = true;
  }
  const destFile = resolve(DIST, path);
  const cacheFile = resolve(CACHE, path);
  await ensureDir(dirname(cacheFile));
  await ensureDir(dirname(destFile));

  if (existsSync(cacheFile)) {
    console.error(`Using cached file ${cacheFile}`);
    return copy(cacheFile, destFile);
  }
  console.error(`Optimizing ${destFile}`);
  const image: Uint8Array = await Deno.readFile(path);

  ImageMagick.read(image, async (img: MagickImage) => {
    img.resize(1200, 0);

    img.write(async (data: Uint8Array) => {
      await Deno.writeFile(cacheFile, data);
      await copy(cacheFile, destFile);
    }, MagickFormat.Jpeg);
  });
}

export async function getExifDate(path: string) {
  const data = await exifer(await Deno.readFile(path));
  const date = parse(data.ModifyDate, "yyyy:MM:dd kk:mm:ss", new Date());
  if (!isValid(date)) {
    throw new Error("could not parse exif ModifyDate");
  }
  return date;
}
