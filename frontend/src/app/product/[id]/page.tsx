import ProductDetailsLoader from '@/components/ProductDetailsLoader';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081';

export async function generateStaticParams() {
  const response = await fetch(`${API_BASE_URL}/api/public/catalog/products`, {
    cache: 'force-cache',
  });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  const products = (data ?? []) as Array<{ id?: string; slug?: string }>;
  const ids = products
    .map((product) => product.id)
    .filter((value): value is string => Boolean(value));
  const slugs = products
    .map((product) => product.slug)
    .filter((value): value is string => Boolean(value));
  return Array.from(new Set([...ids, ...slugs])).map((id) => ({ id }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailsLoader productId={id} />;
}
