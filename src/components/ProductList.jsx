import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ExpiryAlert from "./ExpiryAlert";

export default function ProductList({ refresh, onEdit, readOnly = false, filterStatus = "all", onClearFilter }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("expiryDate"); // default sort

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

            // 1. Filtering
            if (filterStatus !== "all") {
                processedProducts = processedProducts.filter(p =>
                    getExpiryStatus(p.expiryDate, p.notifyBeforeDays).status === filterStatus
                );
            }

            // 2. Sorting
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

    return (
        <div className="product-list">
            <div className="list-header">
                <div className="header-title-group">
                    <h3>📋 {filterStatus !== "all" ? `${filterStatus.replace("-", " ")} items` : "Your Grocery Items"} ({products.length})</h3>
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

            <div className="products-grid">
                {products.map((product) => {
                    const { status, color } = getExpiryStatus(
                        product.expiryDate,
                        product.notifyBeforeDays
                    );
                    const daysLeft = getDaysLeft(product.expiryDate);

                    return (
                        <div
                            key={product._id}
                            className="product-card"
                            style={{ borderLeft: `4px solid ${color}` }}
                        >
                            <div className="product-header">
                                <h4>{product.name}</h4>
                                <div className="header-badges">
                                    <span className="price-badge">₹{product.price}</span>
                                    <span className="quantity-badge">Qty: {product.quantity}</span>
                                </div>
                            </div>

                            <div className="product-details">
                                <p>
                                    <strong>Expiry:</strong>{" "}
                                    {new Date(product.expiryDate).toLocaleDateString("en-IN")}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span style={{ color }}>
                                        {daysLeft < 0
                                            ? "❌ Expired"
                                            : daysLeft === 0
                                                ? "⚠️ Expires Today"
                                                : daysLeft <= product.notifyBeforeDays
                                                    ? `⚠️ ${daysLeft} days left`
                                                    : `✅ ${daysLeft} days left`}
                                    </span>
                                </p>
                                <p>
                                    <strong>Notify Before:</strong> {product.notifyBeforeDays}{" "}
                                    days
                                </p>
                            </div>

                            {status === "expiring-soon" && (
                                <ExpiryAlert product={product} />
                            )}

                            {!readOnly && (
                                <div className="product-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => onEdit(product)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => deleteProduct(product._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
