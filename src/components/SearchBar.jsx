import { useState, useEffect } from "react";
import "./SearchBar.css";

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
        <div className="search-bar-container">
            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search products by name, category, or subcategory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Search products"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="clear-search-btn"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
