import {
  initializeImageMagick,
  ImageMagick,
  MagickImage,
  MagickFormat,
} from "https://deno.land/x/deno_imagemagick/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";

await initializeImageMagick(); // make sure to initialize first!

const DIST = "./dist";

export async function buildOptimizedPhoto(path: string) {
  const image: Uint8Array = await Deno.readFile(path);
  const destFile = resolve(DIST, path);

  ImageMagick.read(image, async (img: MagickImage) => {
    img.resize(1200, 0);

    img.write(async (data: Uint8Array) => {
      await ensureFile(destFile);
      await Deno.writeFile(destFile, data);
    }, MagickFormat.Jpeg);
  });
}
