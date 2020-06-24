import {
  formatDuration,
  intervalToDuration,
} from "https://deno.land/x/date_fns/index.js";
import { buildOptimizedPhoto } from './photos.ts';
import { Template } from "https://deno.land/x/tiny_templates/mod.ts";

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
  console.error(`==> Building ${path}`);
  const stat = await Deno.stat(path);
  const duration = intervalToDuration({ end: stat.birthtime, start: DOB });
  photos.push(photoTemplate.render({
    path,
    createdAt: stat.birthtime,
    dob: DOB,
    duration,
    fridaAgeWords: formatDuration(
      duration,
      { format: ["months", "weeks", "days"] },
    ),
  }));
  console.error(`==> Optimizing ${path}`);
  await buildOptimizedPhoto(path);
}

console.log(indexTemplate.render({
  body: photos.join("\n"),
}));

console.error('==> Build complete');
