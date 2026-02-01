import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

type Options = {
  root: string;
  format: "webp" | "jpg" | "png";
  maxSize: number;        // longest side
  quality: number;        // 1-100
  makeThumb: boolean;
  thumbSize: number;      // longest side for thumb
  overwrite: boolean;     // overwrite existing main.<format>
};

const DEFAULTS: Options = {
  root: path.resolve(process.cwd(), "public/assets"),
  format: "webp",
  maxSize: 1200,
  quality: 82,
  makeThumb: true,
  thumbSize: 360,
  overwrite: true,
};

const IMAGE_EXTS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".avif", ".heic", ".heif",
]);

function isImageFile(p: string) {
  return IMAGE_EXTS.has(path.extname(p).toLowerCase());
}

async function fileExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/**
 * Backup strategy:
 * - For any image we process, we create: <originalFilename>.__orig__<ext>
 *   Example: IMG_1234.jpg  ->  IMG_1234.__orig__.jpg (only if not exists)
 *
 * That means your originals sit right next to the processed output, easy to restore.
 */
async function ensureBackup(originalPath: string) {
  const dir = path.dirname(originalPath);
  const ext = path.extname(originalPath);
  const base = path.basename(originalPath, ext);
  const backupPath = path.join(dir, `${base}.__orig__${ext}`);

  if (!(await fileExists(backupPath))) {
    await fs.copyFile(originalPath, backupPath);
    return { backupPath, created: true };
  }
  return { backupPath, created: false };
}

function outputPaths(folder: string, format: Options["format"]) {
  const main = path.join(folder, `main.${format}`);
  const thumb = path.join(folder, `thumb.${format}`);
  return { main, thumb };
}

async function convertOneTo(
  inputPath: string,
  outputPath: string,
  format: Options["format"],
  maxSize: number,
  quality: number
) {
  let img = sharp(inputPath, { failOnError: false });

  // resize: keep aspect, fit inside box maxSize x maxSize
  img = img.resize({
    width: maxSize,
    height: maxSize,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (format === "webp") {
    img = img.webp({ quality });
  } else if (format === "jpg") {
    img = img.jpeg({ quality, mozjpeg: true });
  } else {
    // png ignores "quality" in same way; we keep decent compression
    img = img.png({ compressionLevel: 9 });
  }

  await img.toFile(outputPath);
}

/**
 * Choose the “source” image per folder:
 * - Prefer something that is NOT a backup file
 * - Prefer the biggest/most likely main image:
 *   - if "main.*" exists already -> treat that as input (so resizing/conversion updates it)
 *   - else take the first non-backup image file
 */
function pickSource(files: string[]) {
  const nonBackup = files.filter((f) => !f.includes(".__orig__"));
  const byName = (name: string) =>
    nonBackup.find((f) => path.basename(f).toLowerCase().startsWith(name));

  return (
    byName("main.") ||
    nonBackup[0] ||
    null
  );
}

async function main() {
  const opts: Options = { ...DEFAULTS };

  console.log(`🔎 Scanning: ${opts.root}`);
  if (!(await fileExists(opts.root))) {
    console.error(`❌ Root not found: ${opts.root}`);
    process.exit(1);
  }

  // We operate folder-by-folder.
  // A folder is considered an “asset folder” if it contains at least one image.
  const allFiles = await walk(opts.root);
  const imageFiles = allFiles.filter(isImageFile);

  // group by folder
  const byFolder = new Map<string, string[]>();
  for (const f of imageFiles) {
    const folder = path.dirname(f);
    byFolder.set(folder, [...(byFolder.get(folder) ?? []), f]);
  }

  let foldersProcessed = 0;
  let imagesProcessed = 0;
  let backupsCreated = 0;

  for (const [folder, files] of [...byFolder.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const src = pickSource(files);
    if (!src) continue;

    // Backup the src if it isn't a backup already
    const backupInfo = await ensureBackup(src);
    if (backupInfo.created) backupsCreated++;

    const { main: mainOut, thumb: thumbOut } = outputPaths(folder, opts.format);

    if (!opts.overwrite && (await fileExists(mainOut))) {
      console.log(`⏭️  Skip (exists): ${path.relative(opts.root, mainOut)}`);
      continue;
    }

    await convertOneTo(src, mainOut, opts.format, opts.maxSize, opts.quality);
    imagesProcessed++;

    if (opts.makeThumb) {
      await convertOneTo(src, thumbOut, opts.format, opts.thumbSize, opts.quality);
      imagesProcessed++;
    }

    foldersProcessed++;
    console.log(`✅ ${path.relative(opts.root, folder)} -> main.${opts.format}${opts.makeThumb ? ` + thumb.${opts.format}` : ""}`);
  }

  console.log(`
Done.
- folders processed: ${foldersProcessed}
- outputs written:   ${imagesProcessed}
- backups created:   ${backupsCreated}
`);
}

main().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
