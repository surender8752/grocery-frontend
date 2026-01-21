import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ editProduct, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        expiryDate: "",
        notifyBeforeDays: 3,
    });

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name,
                quantity: editProduct.quantity,
                expiryDate: editProduct.expiryDate?.split("T")[0] || "",
                notifyBeforeDays: editProduct.notifyBeforeDays,
            });
        }
    }, [editProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

        try {
            if (editProduct) {
                await axios.put(
                    `${API_URL}/product/${editProduct._id}`,
                    formData
                );
                alert("✅ Product Updated!");
            } else {
                await axios.post(`${API_URL}/product`, formData);
                alert("✅ Product Added!");
            }

            setFormData({
                name: "",
                quantity: "",
                expiryDate: "",
                notifyBeforeDays: 3,
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            alert("❌ Error: " + error.message);
        }
    };

    return (
        <div className="product-form">
            <h3>{editProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name *</label>
                    <input
                        type="text"
                        placeholder="e.g., Milk, Bread, Eggs"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Quantity *</label>
                    <input
                        type="number"
                        placeholder="e.g., 2"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                            setFormData({ ...formData, quantity: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) =>
                            setFormData({ ...formData, expiryDate: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Notify Before (Days) *</label>
                    <input
                        type="number"
                        placeholder="e.g., 3"
                        min="1"
                        max="30"
                        value={formData.notifyBeforeDays}
                        onChange={(e) =>
                            setFormData({ ...formData, notifyBeforeDays: e.target.value })
                        }
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">
                    {editProduct ? "Update Product" : "Add Product"}
                </button>
            </form>
        </div>
    );
}
