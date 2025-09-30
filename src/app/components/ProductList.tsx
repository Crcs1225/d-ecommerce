// app/components/ProductList.tsx
"use client";

import { useEffect, useState } from "react";
import SafeImage from "./SafeImage";
import { searchProducts } from "../lib/api";



interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductList({ query }: { query: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    searchProducts(query).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [query]);

  if (loading) return <p className="text-center">Searching...</p>;
  if (!products.length) return <p className="text-center">No products found.</p>;

  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Search Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <SafeImage
            src={p.image}
            alt={p.name}
            width={300}
            height={160}
            className="rounded-md mb-4 object-cover"
            fallbackSrc="/fallback-img-product.png"
            />


            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-green-600 font-bold">${p.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
