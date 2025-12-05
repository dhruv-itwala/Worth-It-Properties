// config/compression.config.js
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";

// 🔵 IMAGE COMPRESSION
export const compressImage = async (inputPath) => {
  const outputPath = inputPath + ".webp";

  await sharp(inputPath).resize(1280).webp({ quality: 40 }).toFile(outputPath);

  await fs.unlink(inputPath);
  return outputPath;
};

// 🔴 VIDEO COMPRESSION
export const compressVideo = async (inputPath) => {
  const outputPath = inputPath + "-compressed.mp4";

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-vcodec libx264",
        "-crf 28",
        "-preset veryfast",
        "-acodec aac",
      ])
      .save(outputPath)
      .on("end", async () => {
        await fs.unlink(inputPath);
        resolve(outputPath);
      })
      .on("error", reject);
  });
};
