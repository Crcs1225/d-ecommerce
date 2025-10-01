"use client";

interface Props {
    query: string;
    setQuery: (q: string) => void;
}

export default function SearchBar({ query, setQuery }: Props) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative group">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg 
                        className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-24 py-4 text-lg bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 placeholder-gray-400 text-gray-700 hover:shadow-2xl hover:bg-white"
                />

                {/* Search Shortcut Hint */}
                <div className="absolute inset-y-0 right-4 flex items-center">
                    <kbd className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-50 text-sm font-sans font-medium text-gray-500 shadow-sm">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
                {["Electronics", "Fashion", "Home & Garden", "Beauty", "Sports"].map((category) => (
                    <button
                        key={category}
                        onClick={() => setQuery(category)}
                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:border-green-300 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}