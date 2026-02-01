import path from "node:path";
import fs from "node:fs/promises";

// ✅ CHANGE THESE IMPORT PATHS to your real files:
import { productModelsSeed } from "../src/data/products";
import { catalogOptions } from "../src/data/options";

type AssetType = "product" | "option";

const FRONTEND_PUBLIC =
  process.env.FRONTEND_PUBLIC ||
  path.resolve(process.cwd(), "../frontend/public");

const BASE_DIR = path.join(FRONTEND_PUBLIC, "assets");

const DRY_RUN = process.env.DRY_RUN === "1";
const KEEP_FILES = process.env.KEEP_FILES !== "0"; // default true

function safeFolderName(key: string) {
  return key.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
  if (KEEP_FILES) {
    await fs.writeFile(path.join(p, ".keep"), "", { flag: "a" });
  }
}

async function createFolders(type: AssetType, keys: string[]) {
  const sub = type === "product" ? "products" : "options";
  const root = path.join(BASE_DIR, sub);

  if (!DRY_RUN) await fs.mkdir(root, { recursive: true });

  for (const key of keys) {
    const dir = path.join(root, safeFolderName(key));
    if (DRY_RUN) {
      console.log(`[DRY] mkdir -p ${dir}`);
    } else {
      await ensureDir(dir);
    }
  }

  console.log(`✅ ${type}: ensured ${keys.length} folders in ${root}`);
}

async function main() {
  const productKeys = Array.from(
    new Set(
      productModelsSeed
        .map((p) => p?.key)
        .filter((k): k is string => typeof k === "string" && k.length > 0)
    )
  ).sort();

  const optionKeys = Array.from(
    new Set(
      catalogOptions
        .map((o) => o?.key)
        .filter((k): k is string => typeof k === "string" && k.length > 0)
    )
  ).sort();

  console.log(`FRONTEND_PUBLIC: ${FRONTEND_PUBLIC}`);
  console.log(`Products: ${productKeys.length} unique keys`);
  console.log(`Options:  ${optionKeys.length} unique keys`);

  await createFolders("product", productKeys);
  await createFolders("option", optionKeys);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
