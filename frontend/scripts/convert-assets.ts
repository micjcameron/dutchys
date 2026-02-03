import fs from "fs";
import path from "path";
import fg from "fast-glob";
import sharp from "sharp";

const SRC_ROOT = path.resolve("public/assets");
const OUT_ROOT = path.resolve("public/assets/_processed");

const SIZES = [
  { name: "sm", width: 400 },
  { name: "md", width: 800 },
  { name: "lg", width: 1200 },
];

async function processImage(inputPath: string) {
  const rel = path.relative(SRC_ROOT, inputPath);
  const parsed = path.parse(rel);

  // skip already-processed
  if (rel.startsWith("_processed")) return;

  for (const size of SIZES) {
    const outDir = path.join(
      OUT_ROOT,
      parsed.dir,
      size.name
    );

    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(
      outDir,
      `${parsed.name}.webp`
    );

    await sharp(inputPath)
      .resize({ width: size.width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outFile);
  }
}

async function run() {
  const files = await fg([
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.png",
  ], { cwd: SRC_ROOT, absolute: true });

  console.log(`Processing ${files.length} images…`);

  for (const file of files) {
    await processImage(file);
  }

  console.log("✅ Asset conversion complete");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
