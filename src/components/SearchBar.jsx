import { useState, useEffect } from "react";

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    const handleClear = () => {
        setSearchTerm("");
        onSearch("");
    };

    return (
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="relative group">
                {/* Search Icon */}
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400 group-focus-within:text-secondary-500 transition-colors pointer-events-none">
                    🔍
                </div>

                {/* Input */}
                <input
                    type="text"
                    placeholder="Search products by name, category, or subcategory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-14 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg font-medium text-gray-800 placeholder-gray-400 focus:border-secondary-500 focus:ring-4 focus:ring-secondary-500/20 focus:shadow-xl transition-all duration-300 outline-none"
                    aria-label="Search products"
                />

                {/* Clear Button */}
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors font-bold text-gray-600"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
