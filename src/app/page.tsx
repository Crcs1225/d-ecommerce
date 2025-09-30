"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import Recommendation from "./components/Recommendation";
import AboutSection from "./components/About";
import ContactSection from "./components/Contact";

export default function HomePage() {
  const [query, setQuery] = useState("");
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Search */}
      <Hero> 
        <SearchBar query={query} setQuery={setQuery}/>
      </Hero>
      {/* Product List */}
      {query && <ProductList query={query} />}
      {/* Recommendation System */}
      <Recommendation />
      {/* About and Contact */}
      <AboutSection />
      <ContactSection />
    </div>
  );
} 