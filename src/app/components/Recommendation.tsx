// app/components/Recommendation.tsx
"use client";

import { useEffect, useState } from "react";
import { getRecommendations } from "../lib/recommender";
import SafeImage from "./SafeImage";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function Recommendation() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getRecommendations().then(setProducts);
  }, []);

  if (!products.length) return null;

  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
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
              className="object-cover rounded-md mb-4"
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
