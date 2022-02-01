import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export const ffmpeg = createFFmpeg({
  // corePath: "http://localhost:3000/public/ffmpeg-core.js",
  // Use public address if you don't want to host your own.
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  log: true,
  logger: ({ message }) => console.log("FFMPEG:", message),
  progress: (p) => console.log("FFMPEG progress:", p),
});

ffmpeg.load();
