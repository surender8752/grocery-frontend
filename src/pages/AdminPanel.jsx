import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import Navbar from "../components/Navbar";
import "./AdminPanel.css";

export default function AdminPanel() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [editProduct, setEditProduct] = React.useState(null);
    const [refreshKey, setRefreshKey] = React.useState(0);
    const [filterStatus, setFilterStatus] = React.useState("all");

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
        <div className="admin-page">
            <Navbar />

            <div className="container">
                <Dashboard onFilter={setFilterStatus} />

                <div className="admin-main-layout" style={{ marginTop: '2rem' }}>
                    <div className="form-column">
                        <ProductForm
                            editProduct={editProduct}
                            onSuccess={handleProductSuccess}
                        />
                    </div>

                    <div className="list-column" style={{ marginTop: '3rem' }}>
                        <ProductList
                            refresh={refreshKey}
                            onEdit={handleEdit}
                            filterStatus={filterStatus}
                            onClearFilter={() => setFilterStatus("all")}
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem' }}>
                    <button onClick={handleLogout} className="btn-secondary">
                        🚪 Logout from Session
                    </button>
                </div>
            </div>
        </div>
    );
}
