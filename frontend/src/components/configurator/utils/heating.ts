const parseKw = (value?: string) => {
  if (!value) return null;
  const match = value.match(/(\d+(?:\.\d+)?)\s*kW/i);
  return match ? Number(match[1]) : null;
};

const sizeFactor = (size?: string | null) => {
  if (!size) return 1;
  if (size.includes('120x190')) return 0.8;
  if (size.includes('180x180')) return 0.9;
  if (size.includes('200')) return 1;
  if (size.includes('225')) return 1.1;
  if (size.includes('240') || size.includes('245')) return 1.2;
  return 1;
};

export const estimateHeatingTime = (power: string | undefined, size: string | null, baseMinutes: number) => {
  const kw = parseKw(power);
  if (!kw) return `${baseMinutes} min`;
  const factor = sizeFactor(size);
  const minutes = Math.round(baseMinutes * factor);
  return `${minutes}-${Math.round(minutes * 1.2)} min`;
};
