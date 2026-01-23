import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ editProduct, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        subcategory: "",
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
                subcategory: editProduct.subcategory || "",
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
                subcategory: "",
                quantity: "",
                price: "",
                expiryDate: "",
                notifyBeforeDays: 3,
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            // Handle duplicate product error (409 Conflict)
            if (error.response?.status === 409) {
                const duplicateInfo = error.response.data;
                const confirmMsg = `⚠️ Duplicate Product!\n\nProduct "${duplicateInfo.existingProduct?.name}" already exists.\nCategory: ${duplicateInfo.existingProduct?.category || 'N/A'}\nQuantity: ${duplicateInfo.existingProduct?.quantity || 'N/A'}\n\nDo you want to edit the existing product instead?`;

                if (window.confirm(confirmMsg)) {
                    // If user confirms, load the existing product for editing
                    if (onSuccess) {
                        // This will trigger a refresh, and they can manually find and edit it
                        alert("Please find and edit the existing product from the list.");
                        onSuccess();
                    }
                }
            } else {
                // Handle other errors
                const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
                alert("❌ Error: " + errorMessage);
            }
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

                <div className="form-group">
                    <label>Subcategory</label>
                    <input
                        type="text"
                        placeholder="e.g., Organic, Fresh, Frozen"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
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
