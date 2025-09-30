// app/lib/api.ts
export async function searchProducts(query: string) {
  // Replace with real API call later
  const mockProducts = [
    { id: "1", name: "Eco Bamboo Toothbrush", price: 3.99, image: "/products/toothbrush.jpg" },
    { id: "2", name: "Reusable Grocery Bag", price: 6.50, image: "/products/grocerybag.jpg" },
    { id: "3", name: "Organic Coconut Soap", price: 4.25, image: "/products/coconutsoap.jpg" },
    { id: "4", name: "Solar-Powered LED Light", price: 12.99, image: "/products/solarlight.jpg" },
    { id: "5", name: "Biodegradable Phone Case", price: 9.75, image: "/products/phonecase.jpg" },
  ];

  return mockProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
}