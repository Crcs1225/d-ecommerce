// app/lib/api.ts
export async function searchProducts(query: string) {
  try {
    // Use the environment variable for backend base URL
    const baseUrl = process.env.BACK_END || "http://localhost:5000";

    const res = await fetch(`${baseUrl}/api/products?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const products = await res.json();
    return products;
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return [];
  }
}