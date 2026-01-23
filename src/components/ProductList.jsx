import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./ProductList.css";

export default function ProductList({ refresh, onEdit, readOnly = false, filterStatus = "all", onClearFilter, searchQuery = "" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("expiryDate");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [dayFilters, setDayFilters] = useState({
        expired: false,
        days1to7: false,
        days7to15: false,
        days15to30: false,
        days30plus: false,
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getDaysLeft = useCallback((expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, []);

    const getExpiryStatus = useCallback((expiryDate, notifyBeforeDays) => {
        const daysLeft = getDaysLeft(expiryDate);

        if (daysLeft < 0) return { status: "expired", color: "#ff4444" };
        if (daysLeft <= notifyBeforeDays)
            return { status: "expiring-soon", color: "#ff9800" };
        return { status: "fresh", color: "#4caf50" };
    }, [getDaysLeft]);

    const handleDayFilterChange = (filter) => {
        setDayFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
    };

    const clearDayFilters = () => {
        setDayFilters({
            expired: false,
            days1to7: false,
            days7to15: false,
            days15to30: false,
            days30plus: false,
        });
    };

    const fetchProducts = useCallback(async () => {
        const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
        try {
            const response = await axios.get(`${API_URL}/products`);
            let processedProducts = [...response.data];

            // Status filter
            if (filterStatus !== "all") {
                processedProducts = processedProducts.filter(p =>
                    getExpiryStatus(p.expiryDate, p.notifyBeforeDays).status === filterStatus
                );
            }

            // Day filter
            const anyDayFilterActive = dayFilters.expired || dayFilters.days1to7 || dayFilters.days7to15 || dayFilters.days15to30 || dayFilters.days30plus;
            if (anyDayFilterActive) {
                processedProducts = processedProducts.filter(p => {
                    const daysLeft = getDaysLeft(p.expiryDate);
                    if (dayFilters.expired && daysLeft < 0) return true;
                    if (dayFilters.days1to7 && daysLeft >= 1 && daysLeft <= 7) return true;
                    if (dayFilters.days7to15 && daysLeft > 7 && daysLeft <= 15) return true;
                    if (dayFilters.days15to30 && daysLeft > 15 && daysLeft <= 30) return true;
                    if (dayFilters.days30plus && daysLeft > 30) return true;
                    return false;
                });
            }

            // Search filter
            if (searchQuery && searchQuery.trim() !== "") {
                const searchLower = searchQuery.toLowerCase().trim();
                processedProducts = processedProducts.filter(p => {
                    const name = (p.name || "").toLowerCase();
                    const category = (p.category || "").toLowerCase();
                    const subcategory = (p.subcategory || "").toLowerCase();
                    return name.includes(searchLower) ||
                        category.includes(searchLower) ||
                        subcategory.includes(searchLower);
                });
            }

            // Sorting
            if (sortBy === "priceHighToLow") {
                processedProducts.sort((a, b) => b.price - a.price);
            } else if (sortBy === "priceLowToHigh") {
                processedProducts.sort((a, b) => a.price - b.price);
            } else if (sortBy === "weightHighToLow") {
                processedProducts.sort((a, b) => (b.weight || 0) - (a.weight || 0));
            } else if (sortBy === "weightLowToHigh") {
                processedProducts.sort((a, b) => (a.weight || 0) - (b.weight || 0));
            } else if (sortBy === "category") {
                processedProducts.sort((a, b) => {
                    const categoryA = (a.category || "").toLowerCase();
                    const categoryB = (b.category || "").toLowerCase();
                    return categoryA.localeCompare(categoryB);
                });
            } else if (sortBy === "subcategory") {
                processedProducts.sort((a, b) => {
                    const subcategoryA = (a.subcategory || "").toLowerCase();
                    const subcategoryB = (b.subcategory || "").toLowerCase();
                    return subcategoryA.localeCompare(subcategoryB);
                });
            } else {
                processedProducts.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
            }

            setProducts(processedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error.response?.data || error.message);
            setLoading(false);
        }
    }, [sortBy, filterStatus, dayFilters, searchQuery, getExpiryStatus, getDaysLeft]);

    useEffect(() => {
        fetchProducts();
    }, [refresh, fetchProducts]);

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

        try {
            await axios.delete(`${API_URL}/product/${id}`);
            alert("✅ Product Deleted!");
            fetchProducts();
        } catch (error) {
            alert("❌ Error deleting product");
        }
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    const renderMobileCards = () => (
        <div>
            {products.map((product) => {
                const { status: expiryStatus } = getExpiryStatus(
                    product.expiryDate,
                    product.notifyBeforeDays
                );
                const daysLeft = getDaysLeft(product.expiryDate);
                const isLowStock = Number(product.quantity) < 5;
                const badgeClass = daysLeft < 0 ? "expired" : (isLowStock ? "low-stock" : expiryStatus);
                const statusLabel = daysLeft < 0 ? "Expired" : (isLowStock ? "Low Stock" : "In Stock");

                return (
                    <div key={product._id} className="product-card">
                        <div className="product-card-header">
                            <div className="product-card-title">
                                <h3>{product.name}</h3>
                                <div className="category">
                                    {product.category || "General"}
                                    {product.subcategory && ` • ${product.subcategory}`}
                                </div>
                            </div>
                            <span className={`status-badge ${badgeClass}`}>
                                {statusLabel}
                            </span>
                        </div>

                        <div className="product-card-details">
                            <div className="product-detail-item">
                                <span className="product-detail-label">Quantity</span>
                                <span className="product-detail-value">{product.quantity}</span>
                            </div>
                            {product.weight && (
                                <div className="product-detail-item">
                                    <span className="product-detail-label">Weight</span>
                                    <span className="product-detail-value">{product.weight}g</span>
                                </div>
                            )}
                            <div className="product-detail-item">
                                <span className="product-detail-label">Price</span>
                                <span className="product-detail-value">₹{product.price}</span>
                            </div>
                            <div className="product-detail-item">
                                <span className="product-detail-label">Expiry Date</span>
                                <span className="product-detail-value">
                                    {new Date(product.expiryDate).toLocaleDateString("en-IN")}
                                </span>
                            </div>
                            <div className="product-detail-item">
                                <span className="product-detail-label">Days Left</span>
                                <span className="product-detail-value" style={{
                                    color: daysLeft < 0 ? '#fc8181' : daysLeft <= product.notifyBeforeDays ? '#f6e05e' : '#68d391'
                                }}>
                                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days ago` : `${daysLeft} days`}
                                </span>
                            </div>
                        </div>

                        {!readOnly && (
                            <div className="product-card-actions">
                                <button
                                    className="btn-ghost"
                                    onClick={() => onEdit(product)}
                                    style={{ border: '1px solid #4a5568', color: '#fff' }}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className="btn-ghost"
                                    onClick={() => deleteProduct(product._id)}
                                    style={{ border: '1px solid #f56565', color: '#f56565' }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderTable = () => (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Weight</th>
                        <th>Price</th>
                        <th>Status</th>
                        {!readOnly && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const { status: expiryStatus } = getExpiryStatus(
                            product.expiryDate,
                            product.notifyBeforeDays
                        );
                        const daysLeft = getDaysLeft(product.expiryDate);
                        const isLowStock = Number(product.quantity) < 5;
                        const badgeClass = daysLeft < 0 ? "expired" : (isLowStock ? "low-stock" : expiryStatus);
                        const statusLabel = daysLeft < 0 ? "Expired" : (isLowStock ? "Low Stock" : "In Stock");

                        return (
                            <tr key={product._id}>
                                <td>
                                    <div className="item-name">{product.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                                        Exp: {new Date(product.expiryDate).toLocaleDateString("en-IN")}
                                    </div>
                                </td>
                                <td className="category-tag">
                                    {product.category || "General"}
                                    {product.subcategory && (
                                        <div style={{ fontSize: '0.85rem', color: '#a0aec0', marginTop: '0.15rem' }}>
                                            {product.subcategory}
                                        </div>
                                    )}
                                </td>
                                <td>{product.quantity}</td>
                                <td>{product.weight ? `${product.weight}g` : '-'}</td>
                                <td>₹{product.price}</td>
                                <td>
                                    <span className={`status-badge ${badgeClass}`}>
                                        {statusLabel}
                                    </span>
                                </td>
                                {!readOnly && (
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-ghost"
                                                onClick={() => onEdit(product)}
                                                style={{ border: '1px solid #4a5568', color: '#fff' }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-ghost"
                                                onClick={() => deleteProduct(product._id)}
                                                style={{ border: '1px solid #f56565', color: '#f56565' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {products.length === 0 && (
                <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p>No items found matching your criteria.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="inventory-section">
            <div className="list-header">
                <div className="header-title-group">
                    <h2>📋 {filterStatus !== "all" ? `${filterStatus.replace("-", " ")} items` : "Recent Items"} ({products.length})</h2>
                    {filterStatus !== "all" && (
                        <button className="btn-clear-filter" onClick={onClearFilter}>
                            ✕ Clear Filter
                        </button>
                    )}
                </div>
                <div className="sort-controls">
                    <label>Sort by: </label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="expiryDate">Expiry Date</option>
                        <option value="category">Category</option>
                        <option value="subcategory">Subcategory</option>
                        <option value="weightHighToLow">Weight: High to Low</option>
                        <option value="weightLowToHigh">Weight: Low to High</option>
                        <option value="priceHighToLow">Price: High to Low</option>
                        <option value="priceLowToHigh">Price: Low to High</option>
                    </select>
                </div>
            </div>

            {/* Day Filter Checkboxes */}
            <div className="day-filter-section">
                <div className="day-filter-label">📅 Filter by Expiry Days:</div>
                <div className="day-filter-checkboxes">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={dayFilters.expired}
                            onChange={() => handleDayFilterChange('expired')}
                        />
                        <span>Expired</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={dayFilters.days1to7}
                            onChange={() => handleDayFilterChange('days1to7')}
                        />
                        <span>1-7 days</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={dayFilters.days7to15}
                            onChange={() => handleDayFilterChange('days7to15')}
                        />
                        <span>7-15 days</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={dayFilters.days15to30}
                            onChange={() => handleDayFilterChange('days15to30')}
                        />
                        <span>15-30 days</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={dayFilters.days30plus}
                            onChange={() => handleDayFilterChange('days30plus')}
                        />
                        <span>30+ days</span>
                    </label>
                    {(dayFilters.expired || dayFilters.days1to7 || dayFilters.days7to15 || dayFilters.days15to30 || dayFilters.days30plus) && (
                        <button className="btn-clear-filter" onClick={clearDayFilters} style={{ marginLeft: '1rem' }}>
                            ✕ Clear Day Filter
                        </button>
                    )}
                </div>
            </div>

            {isMobile ? renderMobileCards() : renderTable()}
        </div>
    );
}
