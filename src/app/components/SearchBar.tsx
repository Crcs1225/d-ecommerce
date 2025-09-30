"use client";

interface Props {
    query: string;
    setQuery: (q: string) => void;
}

export default function SearchBar({ query, setQuery }: Props) {
    return(
        <div className="w-full max-w-lg">
            <input
             type="text" 
             placeholder="Search for products..."
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             className="w-full p-3 rounded-xl border shadow focus:outline-none"
             />
        </div>
    );
}