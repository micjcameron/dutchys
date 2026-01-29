import { notFound, redirect } from 'next/navigation';
import ProductDetails from '@/components/ProductDetails';
import { slugify } from '@/lib/utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081';

function parseId(slugId: string) {
  console.log(slugId)
  const parts = slugId.split('--');
  return parts[parts.length - 1];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slugId: string }>;
}) {
  console.log(await params)
  const { slugId } = await params;
  const id = parseId(slugId);

  const res = await fetch(`${API_BASE_URL}/api/public/catalog/products/${id}`, { cache: 'no-store' });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error('Failed to load product');

  const product = await res.json();

  // ensure canonical URL has correct slug (optional but nice)
  const canonical = `${slugify(product.slug ?? product.name)}--${product.id}`;
  if (canonical !== slugId) redirect(`/product/${canonical}`);

  return <ProductDetails product={product} />;
}
