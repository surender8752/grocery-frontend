import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ editProduct, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        quantity: "",
        price: "",
        expiryDate: "",
        notifyBeforeDays: 3,
    });

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name,
                category: editProduct.category || "",
                quantity: editProduct.quantity,
                price: editProduct.price || "",
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
                category: "",
                quantity: "",
                price: "",
                expiryDate: "",
                notifyBeforeDays: 3,
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            alert("❌ Error: " + error.message);
        }
    };

    return (
        <div className="form-container">
            <h3>{editProduct ? "Edit Product" : "Add New Item"}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name *</label>
                    <input
                        type="text"
                        placeholder="e.g., Bread, Milk"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        placeholder="e.g., Grocery, Dairy, Bakery"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 600 ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Quantity *</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price (₹) *</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Notify Before (Days) *</label>
                    <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.notifyBeforeDays}
                        onChange={(e) => setFormData({ ...formData, notifyBeforeDays: e.target.value })}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                        {editProduct ? "Update Product" : "Add to Inventory"}
                    </button>
                    {editProduct && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => onSuccess()}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
