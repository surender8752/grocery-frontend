import { useState, useEffect } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

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
        <div className="search-container">
            <div className="search-box">
                <div className="search-icon">🔍</div>
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
