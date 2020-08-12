import {
  formatDuration,
  intervalToDuration,
  isAfter,
} from "https://deno.land/x/date_fns/index.js";
import { buildOptimizedPhoto, getExifDate } from "./photos.ts";
import { Template } from "https://raw.githubusercontent.com/zekth/deno_tiny_templates/master/mod.ts";

const DOB = new Date(2020, 3, 17);
const decoder = new TextDecoder("utf-8");

const indexTemplate = new Template(
  decoder.decode(await Deno.readFile("./index.tmpl.html")),
);
const photoTemplate = new Template(
  decoder.decode(await Deno.readFile("./photo.tmpl.html")),
);
const files = await Deno.readDir("./photos");

const photos = [];
for await (const { name } of files) {
  const path = "./photos/" + name;
  console.error(`Building ${path}`);
  let createdAt: Date | null;
  try {
    createdAt = await getExifDate(path);
  } catch (e) {
    const stat = await Deno.stat(path);
    createdAt = stat.birthtime;
  }
  const duration = intervalToDuration({ end: createdAt, start: DOB });
  photos.push({
    path,
    createdAt,
    dob: DOB,
    duration,
    fridaAgeWords: formatDuration(
      duration,
      { format: ["months", "weeks", "days"] },
    ),
  });
  await buildOptimizedPhoto(path);
}

console.log(indexTemplate.render({
  body: photos
    .sort((a, b) => isAfter(b.createdAt, a.createdAt) ? 1 : -1)
    .map((p) => photoTemplate.render(p))
    .join("\n"),
}));

console.error("==> Build complete");
