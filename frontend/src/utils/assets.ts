export type AssetKind = "options" | "products";

type ImageVariant = "main" | number; // main.jpg or 1.jpg/2.jpg/3.jpg etc.

export function assetImagePath(
  kind: AssetKind,
  key: string,
  variant: ImageVariant = "main",
  ext: "jpg" | "webp" | "png" = "jpg"
) {
  const file = variant === "main" ? `main.${ext}` : `${variant}.${ext}`;
  return `/assets/${kind}/${key}/${file}`;
}
