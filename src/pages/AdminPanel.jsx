import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import "./AdminPanel.css";

export default function AdminPanel() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [editProduct, setEditProduct] = React.useState(null);
    const [refreshKey, setRefreshKey] = React.useState(0);

    const handleProductSuccess = () => {
        setEditProduct(null);
        setRefreshKey((prev) => prev + 1);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <div className="admin-header-content">
                    <div>
                        <h1>🛒 Admin Panel</h1>
                        <p>Grocery Inventory Management</p>
                    </div>
                    <div className="admin-info">
                        <div className="admin-badge">
                            <span className="admin-icon">👤</span>
                            <div>
                                <p className="admin-name">{admin?.username}</p>
                                <p className="admin-role">{admin?.role}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="btn-logout">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-container">
                <Dashboard />

                <div className="admin-content">
                    <div className="form-section">
                        <ProductForm
                            editProduct={editProduct}
                            onSuccess={handleProductSuccess}
                        />
                        {editProduct && (
                            <button
                                className="btn-cancel"
                                onClick={() => setEditProduct(null)}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <div className="list-section">
                        <ProductList refresh={refreshKey} onEdit={handleEdit} />
                    </div>
                </div>
            </div>
        </div>
    );
}
