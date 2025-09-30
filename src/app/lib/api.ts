// app/lib/api.ts
import type { Product } from "../components/ProductList";


interface RawProduct {
  _id: string;
  title: string;
  product_description: string;
  rating: number;
  final_price: number;
  images: string;
}


export async function searchProducts(query: string) {
  try {
    // Use the environment variable for backend base URL
    const baseUrl = process.env.NEXT_PUBLIC_BACK_END || "http://localhost:5000";

    const res = await fetch(`${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const rawproducts: RawProduct[] = await res.json();

    const products: Product[] = rawproducts.map((p: RawProduct) => ({
      id: p._id,
      name: p.title,
      description: p.product_description,
      price: p.final_price,
      rating: p.rating,
      image: p.images,
    }));

    return products;
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return [];
  }
}