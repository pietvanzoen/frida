import {
  initializeImageMagick,
  ImageMagick,
  MagickImage,
  MagickFormat,
} from "https://deno.land/x/deno_imagemagick/mod.ts";
import { resolve, dirname } from "https://deno.land/std/path/mod.ts";
import { ensureDir, existsSync, copy } from "https://deno.land/std/fs/mod.ts";

await initializeImageMagick(); // make sure to initialize first!

const DIST = "./dist";
const CACHE = "./.cache";

export async function buildOptimizedPhoto(path: string) {
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
