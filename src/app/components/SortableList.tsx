"use client";

import { useState, useEffect } from "react";
import { request, gql } from "graphql-request";
import SafeImage from "./SafeImage";

const endpoint = process.env.NEXT_PUBLIC_BACK_END
  ? `${process.env.NEXT_PUBLIC_BACK_END}/graphql`
  : "http://localhost:4000/graphql";

// GraphQL query to fetch products with optional category filter
const GET_PRODUCTS = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      title
      category
      product_description
      images
      rating
      final_price
    }
  }
`;

// GraphQL query to fetch unique categories
const GET_CATEGORIES = gql`
  query {
    categories
  }
`;

interface Product {
  id: string;
  title: string;
  category: string;
  product_description: string;
  images: string | null;
  rating: number;
  final_price: number;
}

export default function SortableProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "price">("rating");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await request<{ categories: string[] }>(endpoint, GET_CATEGORIES);
        // Take top 10 categories or all if less than 10
        setCategories(data.categories.slice(0, 10));
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Fallback categories if API fails
        setCategories([
          "Tops", "Dresses", "Electronics", "Beauty", "Home", 
          "Sports", "Books", "Shoes", "Accessories", "Toys"
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const variables = selectedCategory ? { category: selectedCategory } : {};
        const data = await request<{ products: Product[] }>(endpoint, GET_PRODUCTS, variables);
        
        // Limit to 20 products max
        setProducts(data.products.slice(0, 20));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Sort products client-side
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return a.final_price - b.final_price;
    }
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="p-4">
      {/* Categories Filter */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Shop by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClearFilter}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedCategory === null
                ? "bg-green-600 text-white border-green-600 shadow-md"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            All Products
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-green-600 text-white border-green-600 shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Selected Category Indicator */}
        {selectedCategory && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing products in:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {selectedCategory}
            </span>
            <button
              onClick={handleClearFilter}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Sort buttons and product count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        

        <div className="text-sm text-gray-600">
          Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
          {selectedCategory && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedProducts.map((p) => {
            const firstImage = p.images ? p.images.split(",")[0] : "/placeholder.png";
            return (
              <div
                key={p.id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 bg-white"
              >
                <SafeImage
                  src={firstImage}
                  alt={p.title}
                  width={300}
                  height={200}
                  className="h-48 w-full object-cover rounded-lg mb-3"
                  fallbackSrc="/fallback-img-product.png"
                />
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{p.title}</h3>
                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mb-2">
                  {p.category}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{p.rating}</span>
                  </div>
                  <p className="text-green-600 font-bold text-lg">₱{p.final_price}</p>
                </div>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                  {p.product_description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory 
              ? `No products available in ${selectedCategory}. Try another category.`
              : "No products available at the moment."
            }
          </p>
          {selectedCategory && (
            <button
              onClick={handleClearFilter}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Products
            </button>
          )}
        </div>
      )}
    </div>
  );
}