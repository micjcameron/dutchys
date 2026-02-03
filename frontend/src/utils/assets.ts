type AssetType = "product" | "option";
type AssetSize = "sm" | "md" | "lg";

export function assetImage(
  type: AssetType,
  key: string,
  file = "main",
  size: AssetSize = "md"
) {
  return `/assets/_processed/${type}s/${key}/${size}/${file}.webp`;
}
