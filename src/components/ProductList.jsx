import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function ProductList({ refresh, onEdit, readOnly = false, filterStatus = "all", onClearFilter }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("expiryDate");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

    const fetchProducts = useCallback(async () => {
        const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
        try {
            const response = await axios.get(`${API_URL}/products`);
            let processedProducts = [...response.data];

            if (filterStatus !== "all") {
                processedProducts = processedProducts.filter(p =>
                    getExpiryStatus(p.expiryDate, p.notifyBeforeDays).status === filterStatus
                );
            }

            if (sortBy === "priceHighToLow") {
                processedProducts.sort((a, b) => b.price - a.price);
            } else if (sortBy === "priceLowToHigh") {
                processedProducts.sort((a, b) => a.price - b.price);
            } else {
                processedProducts.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
            }

            setProducts(processedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error.response?.data || error.message);
            setLoading(false);
        }
    }, [sortBy, filterStatus, getExpiryStatus]);

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
                        <option value="priceHighToLow">Price: High to Low</option>
                        <option value="priceLowToHigh">Price: Low to High</option>
                    </select>
                </div>
            </div>

            {isMobile ? renderMobileCards() : renderTable()}
        </div>
    );
}
