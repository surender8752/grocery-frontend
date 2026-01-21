import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpiryAlert from "./ExpiryAlert";

export default function ProductList({ refresh, onEdit, readOnly = false }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [refresh]);

    const fetchProducts = async () => {
        const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

        try {
            await axios.delete(`${API_URL}/product/${id}`);
            alert("✅ Product Deleted!");
            fetchProducts();
        } catch (error) {
            alert("❌ Error deleting product");
        }
    };

    const getDaysLeft = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getExpiryStatus = (expiryDate, notifyBeforeDays) => {
        const daysLeft = getDaysLeft(expiryDate);

        if (daysLeft < 0) return { status: "expired", color: "#ff4444" };
        if (daysLeft <= notifyBeforeDays)
            return { status: "expiring-soon", color: "#ff9800" };
        return { status: "fresh", color: "#4caf50" };
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <h3>📦 No Products Yet</h3>
                <p>Add your first grocery item to get started!</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            <h3>📋 Your Grocery Items ({products.length})</h3>

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
                                <span className="quantity-badge">Qty: {product.quantity}</span>
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
